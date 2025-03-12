"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../_helpers/db")); // Import the initialized database Promise
exports.userService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield db_1.default;
        return yield db.User.findAll();
    });
}
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield db_1.default;
        return yield getUser(id, db);
    });
}
function create(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield db_1.default;
        if (yield db.User.findOne({ where: { email: params.email } })) {
            throw new Error(`Email "${params.email}" is already registered`);
        }
        const user = db.User.build(Object.assign(Object.assign({}, params), { firstName: params.firstName || '', lastName: params.lastName || '', role: params.role || '', passwordHash: params.passwordHash || '' }));
        user.passwordHash = yield bcryptjs_1.default.hash(params.password, 10);
        yield user.save();
    });
}
function update(id, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield db_1.default;
        const user = yield getUser(id, db);
        if (params.password) {
            params.passwordHash = yield bcryptjs_1.default.hash(params.password, 10);
        }
        Object.assign(user, params);
        yield user.save();
    });
}
function _delete(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield db_1.default;
        const user = yield getUser(id, db);
        yield user.destroy();
    });
}
function getUser(id, db) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield db.User.findByPk(id);
        if (!user)
            throw new Error('User not found');
        return user;
    });
}
