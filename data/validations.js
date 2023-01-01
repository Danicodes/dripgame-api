const { ObjectId } = require("mongodb");
const Category = require("./assetCategory");

function validateId(id) {
    try{
        let newId = new ObjectId(id);
        return newId;
    } catch(e)
    {
        throw `Invalid object id ${id}`;
    }
}

function validateCategory(categoryString){
    let thisCategory;
    try {
        thisCategory = Category.get(categoryString);
        console.log(thisCategory);
    }
    catch(e){
        throw `Invalid category string ${categoryString}: ${e}`;
    }

    return thisCategory;
}

module.exports= {
    validateId,
    validateCategory
}