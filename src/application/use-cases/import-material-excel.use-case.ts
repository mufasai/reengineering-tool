import type { MaterialRepository } from '../../domain/repositories/interfaces';

export interface ImportMaterialExcelRequest {
  file: File;
  project_id: string;
}

export interface ImportMaterialExcelResponse {
  success: boolean;
  message: string;
  imported_count: number;
  failed_count: number;
  errors?: string[];
}

export class ImportMaterialExcelUseCase {
  constructor(private materialRepository: MaterialRepository) {}

  async execute(request: ImportMaterialExcelRequest): Promise<ImportMaterialExcelResponse> {
    try {
      // Validate file
      if (!request.file) {
        throw new Error('File is required');
      }

      if (!request.project_id) {
        throw new Error('Project ID is required');
      }

      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (!allowedTypes.includes(request.file.type)) {
        throw new Error('File must be Excel format (.xlsx or .xls)');
      }

      // Validate file size (max 10MB)
      if (request.file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Call repository to import materials
      const result = await this.materialRepository.importFromExcel(request.file, request.project_id);
      
      return {
        success: true,
        message: `Successfully imported ${result.imported_count} materials`,
        imported_count: result.imported_count,
        failed_count: result.failed_count,
        errors: result.errors
      };
    } catch (error) {
      console.error('Import material excel failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Import failed',
        imported_count: 0,
        failed_count: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
}