import { UserService } from '../../entities/user-service.entity';
import { User } from '../../entities/user.entity';
import { ServiceCatalog } from '../../entities/service-catalog.entity';

describe('UserServiceEntity', () => {
  let userService: UserService;
  let user: User;
  let service: ServiceCatalog;

  beforeEach(() => {
    // Inicializar las entidades para cada prueba
    userService = new UserService();
    user = new User();
    service = new ServiceCatalog();
  });

  it('should create an empty user service instance', () => {
    expect(userService).toBeDefined();
    expect(userService instanceof UserService).toBeTruthy();
  });

  it('should properly set and get all properties', () => {
    // Arrange
    const now = new Date();
    const testData = {
      id: 1,
      user: user,
      service: service,
      status: 'active',
      assignedAt: now,
      deletedAt: null
    };

    // Act
    Object.assign(userService, testData);

    // Assert
    expect(userService.id).toBe(testData.id);
    expect(userService.user).toBe(testData.user);
    expect(userService.service).toBe(testData.service);
    expect(userService.status).toBe(testData.status);
    expect(userService.assignedAt).toBe(testData.assignedAt);
    expect(userService.deletedAt).toBe(testData.deletedAt);
  });

  it('should properly handle user relationship', () => {
    // Arrange
    user.id = 1;
    user.nombre = 'Test User';
    user.email = 'test@example.com';
    user.password = 'password123';
    user.rol = 'user';

    // Act
    userService.user = user;

    // Assert
    expect(userService.user).toBeDefined();
    expect(userService.user.id).toBe(1);
    expect(userService.user.nombre).toBe('Test User');
  });

  it('should properly handle service relationship', () => {
    // Arrange
    service.id = 1;
    service.nombre = 'Test Service';
    service.descripcion = 'Test Description';
    service.costo = 100;
    service.categoria = 'Test Category';

    // Act
    userService.service = service;

    // Assert
    expect(userService.service).toBeDefined();
    expect(userService.service.id).toBe(1);
    expect(userService.service.nombre).toBe('Test Service');
  });

  it('should properly handle dates', () => {
    // Arrange
    const now = new Date();
    
    // Act
    userService.assignedAt = now;
    userService.deletedAt = now;

    // Assert
    expect(userService.assignedAt instanceof Date).toBeTruthy();
    expect(userService.deletedAt instanceof Date).toBeTruthy();
  });

  it('should initialize with undefined deletedAt', () => {
    expect(userService.deletedAt).toBeUndefined();
  });

  it('should create a complete user service instance with all properties', () => {
    // Arrange
    const now = new Date();
    
    // Configurar usuario de prueba
    user.id = 1;
    user.nombre = 'Test User';
    user.email = 'test@example.com';
    user.rol = 'user';

    // Configurar servicio de prueba
    service.id = 1;
    service.nombre = 'Test Service';
    service.descripcion = 'Test Description';
    service.costo = 100;
    service.categoria = 'Test Category';

    // Act
    userService.id = 1;
    userService.user = user;
    userService.service = service;
    userService.status = 'active';
    userService.assignedAt = now;
    userService.deletedAt = null;

    // Assert
    expect(userService).toBeDefined();
    expect(userService.id).toBe(1);
    expect(userService.user).toBeDefined();
    expect(userService.service).toBeDefined();
    expect(userService.status).toBe('active');
    expect(userService.assignedAt).toBe(now);
    expect(userService.deletedAt).toBeNull();
  });
});