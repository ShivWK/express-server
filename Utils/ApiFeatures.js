const Movie = require("./../Modals/movieModal");
const qs = require("qs");

class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
        this.availableFields = ["name", "description", "rating", "duration", "totalRating", "createdAt", "releaseYear", "releaseDate"]
    }

    filter() {
        const searchParams = qs.parse(this.queryStr);
        const excludeFields = ["sort", "fields", "page", "limit"];

        for (let key in searchParams) {
            if (!this.availableFields.includes(key)) {
                delete searchParams[key];
            }
        }

        const searchStr = JSON.stringify(searchParams);
        const newSearchParams = JSON.parse(searchStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`));

        this.query = this.query.find(newSearchParams);

        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortFields = this.queryStr.sort.split(",");
            
            const isAllowed = sortFields.every(field => {
                const cleanField = field.startsWith("-") ? field.substring(1) : field;

                return this.availableFields.includes(cleanField);
            })

            if (!isAllowed) {
                throw new Error("Invalid Fields");
            }

            const sortBy = sortFields.join(" ");

            this.query = this.query.sort(`${sortBy}`);
        } else {
            this.query = this.query.sort("rating")
        }

        return this;
    }

    limitFields() {
        if (this.queryStr.fields) {
            const limitFields = this.queryStr.fields.split(",");

            const isAllowed = limitFields.every(field => {
                const cleanField = field.startsWith("-") ? field.substring(1) : field;

                return this.availableFields.includes(cleanField);
            })

            if (!isAllowed) {
                throw new Error("Invalid Fields");
            }

            const requiredFields = limitFields.join(" ");

            this.query = this.query.select(`${requiredFields}`);
        } else {
            this.query = this.query.select("-__v")
        }

        return this;
    }

    paginate() {
        const page = +this.queryStr.page || 1;
        const limit = +this.queryStr.limit || 3;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        // if (this.queryStr.page) {
        //     const moviesCount = await Movie.countDocuments();
        //     if (skip >= moviesCount) {
        //         throw new Error("This page is not found");
        //     }
        // }

        return this;
    }
}

module.exports = ApiFeatures;

