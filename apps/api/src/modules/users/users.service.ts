import { Injectable, NotFoundException } from '@nestjs/common';
import { UserMessage } from '../auth/dto/user.message';
import { ProfileMessage } from './dto/profile.message';
import type { UpdateProfileForm } from './dto/update-profile.form';
import {
  ProfileUpdateData,
  UserRepository,
} from '../../database/repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly users: UserRepository) {}

  async getProfile(username: string): Promise<ProfileMessage> {
    const user = await this.users.findByUsernameWithArticleCount(username);
    if (!user) throw new NotFoundException('ไม่พบผู้ใช้');

    return ProfileMessage.from({
      user,
      articleCount: user._count.articles,
    });
  }

  async updateProfile(
    userId: string,
    form: UpdateProfileForm,
  ): Promise<UserMessage> {
    const patch: ProfileUpdateData = {};
    if (form.name !== undefined) patch.name = form.name;
    if (form.bio !== undefined) patch.bio = form.bio || null;
    if (form.avatarUrl !== undefined) patch.avatarUrl = form.avatarUrl || null;

    const user = await this.users.update(userId, patch);
    return UserMessage.from(user);
  }
}
