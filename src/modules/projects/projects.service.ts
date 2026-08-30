import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid project ID format');
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  private async generateAndResolveSlug(
    title: string,
    providedSlug?: string,
    existingProjectId?: string,
  ): Promise<string> {
    let baseSlug = '';

    if (providedSlug && providedSlug.trim().length > 0) {
      baseSlug = this.slugify(providedSlug);
    } else {
      baseSlug = this.slugify(title);
    }

    // Slug Safety Check: Throw 400 Bad Request if slug is empty
    if (!baseSlug || baseSlug.length === 0) {
      throw new BadRequestException(
        'Unable to generate a valid slug from title. Please provide an explicit slug.',
      );
    }

    // Check collision for explicit custom slug
    if (providedSlug && providedSlug.trim().length > 0) {
      const query: any = { slug: baseSlug };
      if (existingProjectId) {
        query._id = { $ne: existingProjectId };
      }
      const existing = await this.projectModel.findOne(query).exec();
      if (existing) {
        throw new ConflictException('Project slug already exists');
      }
      return baseSlug;
    }

    // Auto-generate unique slug with numeric suffix if collision occurs
    let candidateSlug = baseSlug;
    let counter = 1;

    while (true) {
      const query: any = { slug: candidateSlug };
      if (existingProjectId) {
        query._id = { $ne: existingProjectId };
      }
      const existing = await this.projectModel.findOne(query).exec();
      if (!existing) {
        return candidateSlug;
      }
      candidateSlug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const slug = await this.generateAndResolveSlug(
      createProjectDto.title,
      createProjectDto.slug,
    );

    const projectData = {
      ...createProjectDto,
      slug,
      isPublished: createProjectDto.isPublished ?? false, // Defaults to draft false
      isFeatured: createProjectDto.isFeatured ?? false,
      displayOrder: createProjectDto.displayOrder ?? 0,
    };

    const newProject = new this.projectModel(projectData);
    return newProject.save();
  }

  async findAllPublic(queryDto: ProjectQueryDto) {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const skip = (page - 1) * limit;

    const filter: any = { isPublished: true };

    if (queryDto.isFeatured !== undefined) {
      filter.isFeatured = queryDto.isFeatured;
    }
    if (queryDto.projectType) {
      filter.projectType = queryDto.projectType;
    }
    if (queryDto.status) {
      filter.status = queryDto.status;
    }

    const [data, total] = await Promise.all([
      this.projectModel
        .find(filter)
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.projectModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findBySlugPublic(slug: string): Promise<Project> {
    const normalizedSlug = slug.toLowerCase().trim();
    const project = await this.projectModel
      .findOne({ slug: normalizedSlug, isPublished: true })
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async findAllAdmin(queryDto: ProjectQueryDto) {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (queryDto.search && queryDto.search.trim().length > 0) {
      filter.title = { $regex: queryDto.search.trim(), $options: 'i' };
    }
    if (queryDto.isPublished !== undefined) {
      filter.isPublished = queryDto.isPublished;
    }
    if (queryDto.isFeatured !== undefined) {
      filter.isFeatured = queryDto.isFeatured;
    }
    if (queryDto.projectType) {
      filter.projectType = queryDto.projectType;
    }
    if (queryDto.status) {
      filter.status = queryDto.status;
    }

    const [data, total] = await Promise.all([
      this.projectModel
        .find(filter)
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.projectModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findByIdAdmin(id: string): Promise<Project> {
    this.validateObjectId(id);
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async updateAdmin(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    this.validateObjectId(id);

    const existingProject = await this.projectModel.findById(id).exec();
    if (!existingProject) {
      throw new NotFoundException('Project not found');
    }

    const updateData: any = { ...updateProjectDto };

    // Handle slug update if slug or title is provided
    if (updateProjectDto.slug !== undefined || updateProjectDto.title !== undefined) {
      const targetTitle = updateProjectDto.title || existingProject.title;
      updateData.slug = await this.generateAndResolveSlug(
        targetTitle,
        updateProjectDto.slug,
        id,
      );
    }

    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateData, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();

    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }

    return updatedProject;
  }

  async deleteAdmin(id: string): Promise<{ message: string }> {
    this.validateObjectId(id);
    const deleted = await this.projectModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Project not found');
    }
    return { message: 'Project deleted successfully' };
  }
}
