import { DefaultNamingStrategy } from 'typeorm';

export class CustomNamingStrategy extends DefaultNamingStrategy {
  tableName(targetName: string, userSpecifiedName: string): string {
    return `${userSpecifiedName || targetName?.toLowerCase()}_table`;
  }
}
