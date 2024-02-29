import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}
  //runs with startup of the application and creates admin details in database (seeding database)
  async onModuleInit() {
    await this.create({
      firstName: 'root',
      lastName: 'root',
      username: 'root',
      password: 'root',
    });
  }

  async create(createAdminDto: CreateAdminDto) {
    const userExists = await this.findOneByUsername(createAdminDto.username);
    if (userExists) {
      return;
    }
    const saltRounds = 10;
    const password = await bcrypt.hash(createAdminDto.password, saltRounds);
    const admin = this.adminRepository.create({ ...createAdminDto, password });
    return await this.adminRepository.save(admin);
  }

  async findAll() {
    return await this.adminRepository.find();
  }

  async findOneByUsername(username: string) {
    return await this.adminRepository.findOne({ where: { username } });
  }

  async findOne(id: number) {
    return await this.adminRepository.findOne({ where: { id } });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.findOne(id);

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    return this.adminRepository.save({ id, ...updateAdminDto });
  }

  async remove(id: number) {
    return await this.adminRepository.delete({ id });
  }
}
