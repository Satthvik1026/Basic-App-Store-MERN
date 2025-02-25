import { create } from "zustand";

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }), // This is like useState but global

    createProduct: async (newProduct) => {
        if (!newProduct.name || !newProduct.image || !newProduct.price) {
            return { success: false, message: "Please fill in all fields." };
        }
        try {
            const res = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newProduct)
            });
            const data = await res.json();
            set((state) => ({ products: [...state.products, data.data] }));
            return { success: true, message: "Product created successfully" };
        } catch (error) {
            console.error("Error creating product:", error);
            return { success: false, message: "An error occurred while creating product" };
        }
    },

    fetchProducts: async () => {
        try {
            const res = await fetch("http://localhost:5000/api/products");
            const data = await res.json();
            set({ products: data.data });
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    },

    deleteProduct: async (pid) => {
        try {
            const res = await fetch(`http://localhost:5000/api/products/${pid}`, { method: "DELETE" });
            const data = await res.json();

            if (!res.ok) {
                console.error("Delete request failed:", data);
                return { success: false, message: data.message || "Failed to delete product" };
            }

            set(state => ({ products: state.products.filter(product => product._id !== pid) }));
            return { success: true, message: "Product deleted successfully" };
        } catch (error) {
            console.error("Error deleting product:", error);
            return { success: false, message: "An error occurred" };
        }
    },
    updateProduct: async (pid, updateProduct) => {
        try {
            const res = await fetch(`http://localhost:5000/api/products/${pid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateProduct)
            });

            const data = await res.json();
            if (!res.ok) {
                return { success: false, message: data.message || "Failed to update product" };
            }

            // Update the UI immediately without needing a refresh
            set((state) => ({
                products: state.products.map((product) =>
                    product._id === pid ? data.data : product
                )
            }));

            return { success: true, message: "Product updated successfully" };
        } catch (error) {
            console.error("Error updating product:", error);
            return { success: false, message: "An error occurred while updating product" };
        }
    }

}));
