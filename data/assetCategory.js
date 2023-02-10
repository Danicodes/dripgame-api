class Category {
    constructor(name){
        this.name = name;
    };

    static Tops = new Category("Tops");
    static Bottoms = new Category("Bottoms");
    static Shoes = new Category("Shoes");
    static Models = new Category("Models"); // don't want to conflate models and poses
    static Hair = new Category("Hair");
    static Face = new Category("Face");
    static Accessories = new Category("Accessories");
    static Set = new Category("Set"); // Replacing suit
    static Background = new Category("Background"); //

    static get(string) {
        switch(string.trim().toLowerCase()) {
            case "tops":
            case "top":
                return this.Tops;
            case "bottoms":
            case "bottom":
                return this.Bottoms;
            case "shoes":
            case "shoe":
                return this.Shoes;
            case "hair":
                return this.Hair;
            case "face":
                return this.Face;
            case "accessories":
                return this.Accessories;
            case "set":
            case "suit":
                return this.Set;
            case "model":
            case "pose":
                return this.Models 
            case "background":
            case "backdrop":
                return this.Background
            default:
                throw `Error: Undefined Category`;
        }
    }

    static getAll() {
        return [
            this.Tops.name,
            this.Bottoms.name,
            this.Shoes.name,
            this.Models.name,
            this.Hair.name,
            this.Face.name,
            this.Accessories.name,
            this.Set.name,
            this.Background.name
        ]
    }

}

module.exports = Category;
