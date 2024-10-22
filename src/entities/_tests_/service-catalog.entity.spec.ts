import { ServiceCatalog } from '../service-catalog.entity';
import { UserService } from '../../entities/user-service.entity';

describe('ServiceCatalogEntity', () => {
  let serviceCatalog: ServiceCatalog;

  beforeEach(() => {
    serviceCatalog = new ServiceCatalog();
  });

  it('should create an empty service catalog instance', () => {
    expect(serviceCatalog).toBeDefined();
    expect(serviceCatalog instanceof ServiceCatalog).toBeTruthy();
  });

  it('should properly set and get all properties', () => {
    // Arrange
    const testData = {
      id: 1,
      nombre: 'Gasolina',
      descripcion: 'Obtención y consumo de combustible',
      costo: 10.99,
      categoria: 'Transporte',
      userServices: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };

    // Act
    Object.assign(serviceCatalog, testData);

    // Assert
    expect(serviceCatalog.id).toBe(testData.id);
    expect(serviceCatalog.nombre).toBe(testData.nombre);
    expect(serviceCatalog.descripcion).toBe(testData.descripcion);
    expect(serviceCatalog.costo).toBe(testData.costo);
    expect(serviceCatalog.categoria).toBe(testData.categoria);
    expect(serviceCatalog.userServices).toEqual(testData.userServices);
    expect(serviceCatalog.createdAt).toBe(testData.createdAt);
    expect(serviceCatalog.updatedAt).toBe(testData.updatedAt);
    expect(serviceCatalog.deletedAt).toBe(testData.deletedAt);
  });

  it('should properly handle userServices relationship', () => {
    // Arrange
    const mockUserService = new UserService();
    serviceCatalog.userServices = [mockUserService];

    // Assert
    expect(serviceCatalog.userServices).toHaveLength(1);
    expect(serviceCatalog.userServices[0]).toBe(mockUserService);
  });

  it('should handle decimal values for costo', () => {
    // Arrange
    const decimalCosto = 10.99;
    
    // Act
    serviceCatalog.costo = decimalCosto;

    // Assert
    expect(serviceCatalog.costo).toBe(decimalCosto);
    expect(typeof serviceCatalog.costo).toBe('number');
  });

  it('should properly format dates', () => {
    // Arrange
    const now = new Date();
    
    // Act
    serviceCatalog.createdAt = now;
    serviceCatalog.updatedAt = now;

    // Assert
    expect(serviceCatalog.createdAt instanceof Date).toBeTruthy();
    expect(serviceCatalog.updatedAt instanceof Date).toBeTruthy();
  });

  it('should initialize with null deletedAt', () => {
    expect(serviceCatalog.deletedAt).toBeUndefined();
  });

  it('should create a complete service catalog instance with all properties', () => {
    // Arrange
    const complete = new ServiceCatalog();
    const now = new Date();
    
    // Act
    complete.id = 1;
    complete.nombre = 'Gasolina';
    complete.descripcion = 'Obtención y consumo de combustible';
    complete.costo = 10.99;
    complete.categoria = 'Transporte';
    complete.userServices = [];
    complete.createdAt = now;
    complete.updatedAt = now;
    complete.deletedAt = null;

    // Assert
    expect(complete).toMatchObject({
       id: 1,
       nombre: 'Gasolina',
       descripcion: 'Obtención y consumo de combustible',
       costo: 10.99,
       categoria: 'Transporte',
       userServices: [],
       createdAt: now,
       updatedAt: now,
       deletedAt: null
    });
  });
});