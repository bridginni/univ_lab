import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { NotFoundException } from '@nestjs/common';

describe('PostController', () => {
	let postController: PostController;
	let prismaService: PrismaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PostController],
			providers: [PrismaService],
		}).compile();

		postController = module.get<PostController>(PostController);
		prismaService = module.get<PrismaService>(PrismaService);
	});

	describe('create', () => {
		it('should create a new post', async () => {
			const createPostDto: CreatePostDto = { title: 'Test Post', content: 'This is a test post' };
			const userId = 1;

			// @ts-ignore
			const createPostSpy = jest.spyOn(prismaService.post, 'create').mockImplementation(() => Promise.resolve({} as any));
			// @ts-ignore
			jest.spyOn(prismaService.user, 'findUnique').mockImplementation(() => Promise.resolve({ id: userId } as any));

			const result = await postController.create(createPostDto, { user: { id: userId } });

			expect(createPostSpy).toHaveBeenCalledWith({ data: { ...createPostDto, authorId: userId } });
			expect(result).toEqual({});
		});
	});

	describe('findAll', () => {
		it('should return an array of posts', async () => {
			const posts: any[] = [{ id: 1, title: 'Post 1', content: 'Content 1' }, { id: 2, title: 'Post 2', content: 'Content 2' }];

			// @ts-ignore
			jest.spyOn(prismaService.post, 'findMany').mockImplementation(() => Promise.resolve(posts));

			const result = await postController.findAll();

			expect(result).toEqual(posts);
		});
	});

	describe('createComment', () => {
		it('should create a new comment for a post', async () => {
			const createPostCommentDto: { postId: number; content: string } = { postId: 1, content: 'This is a comment' };
			const userId = 1;

			// @ts-ignore
			const createCommentSpy = jest.spyOn(prismaService.postComment, 'create').mockImplementation(() => Promise.resolve({} as any));
			// @ts-ignore
			jest.spyOn(prismaService.user, 'findUnique').mockImplementation(() => Promise.resolve({ id: userId } as any));

			const result = await postController.createComment(createPostCommentDto, { user: { id: userId } });

			expect(createCommentSpy).toHaveBeenCalledWith({ data: { ...createPostCommentDto, authorId: userId } });
			expect(result).toEqual({});
		});
	});

	describe('findOne', () => {
		it('should return a post with the specified ID', async () => {
			const postId = 1;
			const post = { id: postId, title: 'Test Post', content: 'This is a test post' };

			// @ts-ignore
			jest.spyOn(prismaService.post, 'findUnique').mockImplementation(() => Promise.resolve(post));

			const result = await postController.findOne(postId);

			expect(result).toEqual(post);
		});

		it('should throw a NotFoundException when post is not found', async () => {
			const postId = 1;

			// @ts-ignore
			jest.spyOn(prismaService.post, 'findUnique').mockImplementation(() => Promise.resolve(null));

			expect(postController.findOne(postId)).rejects.toThrowError(NotFoundException);
		});
	});
});