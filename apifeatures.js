class Apifeatures{
    constructor(query,querystr) {
        this.query = query;
        this.querystr = querystr
    }
    filter() {
        const obj = {...this.querystr};
        const exclude = ["sort","fields","page","limit"];
        exclude.forEach(element => {
            delete obj[element];
        });
        let querystring = JSON.stringify(obj);
        querystring = querystring.replace(/\b(gte|gt|lte|lt)\b/g,match => `$${match}`);
        const queryobj = JSON.parse(querystring);
        this.query = this.query.find(queryobj);
        return this;
    }
    sort() {
        if(this.querystr.sort) {
            const sortby = this.querystr.sort.split(",").join(" ");
            this.query = this.query.sort(sortby);
        }
        else{
            this.query = this.query.sort('createdAt');
        }
        return this;
    }
    limiting() {
        if(this.querystr.fields) {
            const  field  = this.querystr.fields.split(",").join(" ");
            this.query =this.query.select(field);
        }
        else{
            this.query = this.query.select('-__v');
        }
        return this;
    }
    pagination() {
        const page  = this.querystr.page*1||1;
        const limit = this.querystr.limit*1||10;
        const skip = (page-1)*limit;
        console.log(`Page:${page},Limit:${limit},Skip:${skip}`);
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
module.exports = Apifeatures;