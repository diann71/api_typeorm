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
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const validate_request_1 = __importDefault(require("../_middleware/validate-request"));
const role_1 = __importDefault(require("../_helpers/role"));
const user_service_1 = require("../users/user.service");
const router = express_1.default.Router();
// Routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
exports.default = router;
// Route functions
function getAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_service_1.userService.getAll();
            res.json(users);
        }
        catch (error) {
            next(error);
        }
    });
}
function getById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_service_1.userService.getById(Number(req.params.id));
            res.json(user);
        }
        catch (error) {
            next(error);
        }
    });
}
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield user_service_1.userService.create(req.body);
            res.json({ message: 'User created' });
        }
        catch (error) {
            next(error);
        }
    });
}
function update(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield user_service_1.userService.update(Number(req.params.id), req.body);
            res.json({ message: 'User updated' });
        }
        catch (error) {
            next(error);
        }
    });
}
function _delete(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield user_service_1.userService.delete(Number(req.params.id));
            res.json({ message: 'User deleted' });
        }
        catch (error) {
            next(error);
        }
    });
}
// Schema functions
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        role: joi_1.default.string().valid(role_1.default.Admin, role_1.default.User).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required()
    });
    (0, validate_request_1.default)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().allow(''),
        firstName: joi_1.default.string().allow(''),
        lastName: joi_1.default.string().allow(''),
        role: joi_1.default.string().valid(role_1.default.Admin, role_1.default.User).allow(''),
        email: joi_1.default.string().email().allow(''),
        password: joi_1.default.string().min(6).allow(''),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).allow('')
    }).with('password', 'confirmPassword');
    (0, validate_request_1.default)(req, next, schema);
}
