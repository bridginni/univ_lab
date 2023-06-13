import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('UserController', () => {
	let userController: UserController;
	let prismaService: PrismaService;
	let authService: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				PrismaService,
				AuthService,
				{ provide: JwtService, useValue: {} },
			],
		}).compile();

		userController = module.get<UserController>(UserController);
		prismaService = module.get<PrismaService>(PrismaService);
		authService = module.get<AuthService>(AuthService);
	});

	describe('register', () => {
		it('should register a new user', async () => {
			const createUserDto: CreateUserDto = {
				// @ts-ignore
				username: 'testuser',
				email: 'test@example.com',
				password: 'password',
			};
			const user = { id: 1, ...createUserDto };

			// @ts-ignore
			jest.spyOn(prismaService.user, 'create').mockResolvedValue(user);

			const result = await userController.register(createUserDto);

			expect(result).toEqual({
				message: 'User registered successfully',
				user,
			});
		});
	});

	describe('login', () => {
		it('should login with valid credentials', async () => {
			const loginDto: LoginDto = {
				email: 'test@example.com',
				password: 'password',
			};
			const user = { id: 1, email: loginDto.email, password: 'hashedPassword' };
			const token = 'testToken';

			jest
				.spyOn(authService, 'validateUser')
				// @ts-ignore
				.mockResolvedValue(user);
			jest.spyOn(authService, 'generateToken').mockResolvedValue(token);

			const result = await userController.login(loginDto);

			expect(result).toEqual({ token });
		});

		it('should throw an UnauthorizedException with invalid credentials', async () => {
			const loginDto: LoginDto = {
				email: 'test@example.com',
				password: 'wrongPassword',
			};

			jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

			await expect(userController.login(loginDto)).rejects.toThrowError(
				UnauthorizedException,
			);
		});
	});

	describe('me', () => {
		it('should return the authenticated user', async () => {
			const user = { id: 1, username: 'testuser', email: 'test@example.com' };
			const request = { user: { id: user.id } };

			// @ts-ignore
			jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

			const result = await userController.me(null, request);

			expect(result).toEqual(user);
		});
	});
});
