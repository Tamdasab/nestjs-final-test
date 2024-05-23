import { Injectable, ConflictException } from '@nestjs/common';
import { User } from './model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findById(userId: number): Promise<User> {
        return await this.userRepository.findOne({
            where: { id: userId },
        });
    }

    async createUser(email: string): Promise<User> {
        const user = new User();
        user.email = email;

        const existingUser = await this.userRepository.findOne({
            where: { email: user.email },
        });
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        return await this.userRepository.save(user);
    }

    async getUser(email: string): Promise<User> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async resetData(): Promise<void> {
        await this.userRepository.delete({});
    }
}
