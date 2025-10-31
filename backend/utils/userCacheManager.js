import db from '../models/index.js';
import logger from './logger.js';

const { Users } = db;


export class UserCacheManager {
    constructor() {
        this.cache = new Map();
    }


    generateKey(tipo_doc, num_doc) {
        return `${tipo_doc}|${num_doc}`;
    }


    get(tipo_doc, num_doc) {
        const key = this.generateKey(tipo_doc, num_doc);
        return this.cache.get(key);
    }


    set(tipo_doc, num_doc, user) {
        const key = this.generateKey(tipo_doc, num_doc);
        this.cache.set(key, user);
    }

    has(tipo_doc, num_doc) {
        const key = this.generateKey(tipo_doc, num_doc);
        return this.cache.has(key);
    }

    async applyUpdates(user, extraData, transaction) {
        if (!extraData || typeof extraData !== 'object') return user;

        const updates = {};
        for (const [key, value] of Object.entries(extraData)) {
            if (value === undefined || value === null) continue;
            if (user[key] === undefined || user[key] === null) {
                updates[key] = value;
            }
        }

        if (Object.keys(updates).length > 0) {
            await user.update(updates, { transaction });
            Object.assign(user, updates);
        }

        return user;
    }

    async getOrCreate(tipo_doc, num_doc, extraData = {}, transaction) {
        if (this.has(tipo_doc, num_doc)) {
            const cached = this.get(tipo_doc, num_doc);
            await this.applyUpdates(cached, extraData, transaction);
            return cached;
        }

        let user = await Users.findOne({
            where: { tipo_doc, num_doc },
            transaction
        });

        if (user) {
            user = await this.applyUpdates(user, extraData, transaction);
            this.set(tipo_doc, num_doc, user);
            return user;
        }

        user = await Users.create(
            { tipo_doc, num_doc, ...extraData },
            { transaction }
        );

        this.set(tipo_doc, num_doc, user);
        logger.info(`Usuario creado: ${tipo_doc} ${num_doc}`);

        return user;
    }

    getAllUsers() {
        return Array.from(this.cache.values());
    }

    clear() {
        this.cache.clear();
    }


    getStats() {
        return {
            totalUsers: this.cache.size
        };
    }
}