class Category {
    constructor(name){
        this.name = name;
    };

    static Tops = new Category("Tops");
    static Bottoms = new Category("Bottoms");
    static Shoes = new Category("Shoes");
    static Poses = new Category("Poses"); // don't want to conflate models and poses
    static Hair = new Category("Hair");
    static Face = new Category("Face");
    static Accessories = new Category("Accessories");
    static Set = new Category("Set"); // Replacing suit

    static get(string) {
        switch(string.trim().toLowerCase()) {
            case "tops" || "top":
                return this.Tops;
            case "bottoms" || "bottom":
                return this.Bottoms;
            case "shoes" || "shoe":
                return this.Shoes;
            case "hair":
                return this.Hair;
            case "face":
                return this.Face;
            case "accessories":
                return this.Accessories;
            case "set" || "suit":
                return this.Set;
            default:
                throw `Error: Undefined Category`;
        }
    }
}

module.exports = Category;
