import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

class RedisService {
  constructor() {
    this.client = null;
    this.connect();
  }

  async connect() {
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });

      this.client.on('connect', () => {
        console.log('✅ Connected to Redis');
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      // Fallback to in-memory storage for development
      this.memoryStore = new Map();
    }
  }

  async get(key) {
    try {
      if (this.client && this.client.isOpen) {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
      } else if (this.memoryStore) {
        return this.memoryStore.get(key) || null;
      }
      return null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key, value, expirySeconds = null) {
    try {
      const serialized = JSON.stringify(value);
      
      if (this.client && this.client.isOpen) {
        if (expirySeconds) {
          await this.client.setEx(key, expirySeconds, serialized);
        } else {
          await this.client.set(key, serialized);
        }
      } else if (this.memoryStore) {
        this.memoryStore.set(key, value);
        if (expirySeconds) {
          setTimeout(() => {
            this.memoryStore.delete(key);
          }, expirySeconds * 1000);
        }
      }
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  async delete(key) {
    try {
      if (this.client && this.client.isOpen) {
        await this.client.del(key);
      } else if (this.memoryStore) {
        this.memoryStore.delete(key);
      }
      return true;
    } catch (error) {
      console.error('Redis DELETE error:', error);
      return false;
    }
  }

  async exists(key) {
    try {
      if (this.client && this.client.isOpen) {
        const result = await this.client.exists(key);
        return result === 1;
      } else if (this.memoryStore) {
        return this.memoryStore.has(key);
      }
      return false;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }
}

export default new RedisService();

