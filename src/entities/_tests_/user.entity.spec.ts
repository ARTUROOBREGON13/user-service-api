import { User } from '../../entities/user.entity';
import { UserService } from '../../entities/user-service.entity';
import { isEmail } from 'class-validator';

describe('UserEntity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
  });

  it('should create an empty user instance', () => {
    expect(user).toBeDefined();
    expect(user instanceof User).toBeTruthy();
  });

  it('should properly set and get all properties', () => {
    // Arrange
    const now = new Date();
    const testData = {
      id: 1,
      nombre: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword123',
      rol: 'user',
      userServices: [],
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };

    // Act
    Object.assign(user, testData);

    // Assert
    expect(user.id).toBe(testData.id);
    expect(user.nombre).toBe(testData.nombre);
    expect(user.email).toBe(testData.email);
    expect(user.password).toBe(testData.password);
    expect(user.rol).toBe(testData.rol);
    expect(user.userServices).toEqual([]);
    expect(user.createdAt).toBe(testData.createdAt);
    expect(user.updatedAt).toBe(testData.updatedAt);
    expect(user.deletedAt).toBe(testData.deletedAt);
  });

  it('should handle user services relationship', () => {
    // Arrange
    const userService1 = new UserService();
    const userService2 = new UserService();
    
    // Act
    user.userServices = [userService1, userService2];

    // Assert
    expect(user.userServices).toHaveLength(2);
    expect(user.userServices).toContain(userService1);
    expect(user.userServices).toContain(userService2);
  });

  it('should default nombre to undefined when not specified', () => {
    // Act
    const newUser = new User();

    // Assert
    expect(newUser.nombre).toBeUndefined();
  });

  it('should properly handle dates', () => {
    // Arrange
    const now = new Date();
    
    // Act
    user.createdAt = now;
    user.updatedAt = now;
    user.deletedAt = now;

    // Assert
    expect(user.createdAt instanceof Date).toBeTruthy();
    expect(user.updatedAt instanceof Date).toBeTruthy();
    expect(user.deletedAt instanceof Date).toBeTruthy();
  });

  it('should initialize with undefined deletedAt', () => {
    expect(user.deletedAt).toBeUndefined();
  });

  it('should validate email format', () => {
    // Arrange
    const validEmails = [
      'test@example.com',
      'user.name@domain.com',
      'user+label@domain.co.uk'
    ];
    
    const invalidEmails = [
      'invalid-email',
      '@domain.com',
      'user@',
      'user@.com',
      'user@domain.'
    ];

    // Act & Assert
    validEmails.forEach((email) => {
      user.email = email;
      expect(user.email).toBe(email);
    });

    invalidEmails.forEach((email) => {
      user.email = email;
      expect(isEmail(user.email)).toBe(false);
    });
  });
});