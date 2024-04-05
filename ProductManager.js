const fs = require('fs');

class ProductManager {
    constructor(path, productConstructor) {
        this.path = path;
        this.productConstructor = productConstructor;
    }

    addProduct(product) {
        try {
            const products = this.getProducts();
            product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
            products.push(product);
            this.saveData(products);
            console.log('Producto agregado correctamente.');
        } catch (error) {
            console.error('Error al agregar el producto:', error.message);
        }
    }

    getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = fs.readFileSync(this.path);
                return JSON.parse(data).map(productData => new this.productConstructor(productData));
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al obtener los productos:', error.message);
            return [];
        }
    }

    getProductById(productId) {
        try {
            const products = this.getProducts();
            const product = products.find(product => product.id === productId);
            if (product) {
                console.log('Producto encontrado.');
                return product;
            } else {
                console.log('Producto no encontrado.');
                return null;
            }
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error.message);
            return null;
        }
    }

    updateProduct(productId, newData) {
        try {
            const products = this.getProducts();
            const index = products.findIndex(product => product.id === productId);
            if (index !== -1) {
                products[index] = { ...products[index], ...newData };
                this.saveData(products);
                console.log('Producto actualizado correctamente.');
                return true;
            } else {
                console.log('Producto no encontrado.');
                return false;
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error.message);
            return false;
        }
    }

    deleteProduct(productId) {
        try {
            let products = this.getProducts();
            const index = products.findIndex(product => product.id === productId);
            if (index !== -1) {
                products.splice(index, 1);
                this.saveData(products);
                console.log('Producto eliminado correctamente.');
                return true;
            } else {
                console.log('Producto no encontrado.');
                return false;
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error.message);
            return false;
        }
    }

    saveData(products) {
        try {
            fs.writeFileSync(this.path, JSON.stringify(products, null, 4));
            console.log('Datos guardados correctamente.');
        } catch (error) {
            console.error('Error al guardar los datos:', error.message);
        }
    }
}

module.exports = ProductManager;
