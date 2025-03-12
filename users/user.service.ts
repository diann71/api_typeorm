import bcrypt from 'bcryptjs';
import dbPromise from '../_helpers/db'; // Import the initialized database Promise

interface UserAttributes {
    title: string;
    id?: number;
    email: string;
    password?: string;
    passwordHash?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}

export const userService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const db = await dbPromise;
    return await db.User.findAll();
}

async function getById(id: number) {
    const db = await dbPromise;
    return await getUser(id, db);
}

async function create(params: UserAttributes) {
    const db = await dbPromise;
    
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw new Error(`Email "${params.email}" is already registered`);
    }

    const user = db.User.build({
        ...params,
        firstName: params.firstName || '',
        lastName: params.lastName || '',
        role: params.role || '',
        passwordHash: params.passwordHash || ''
    });
    user.passwordHash = await bcrypt.hash(params.password as string, 10);
    
    await user.save();
}

async function update(id: number, params: UserAttributes) {
    const db = await dbPromise;
    const user = await getUser(id, db);

    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    Object.assign(user, params);
    await user.save();
}

async function _delete(id: number) {
    const db = await dbPromise;
    const user = await getUser(id, db);
    await user.destroy();
}

async function getUser(id: number, db: any) {
    const user = await db.User.findByPk(id);
    if (!user) throw new Error('User not found');
    return user;
}
