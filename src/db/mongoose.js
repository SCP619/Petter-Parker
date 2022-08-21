import mongoose from 'mongoose'

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/parking', { useNewUrlParser: true })

export default mongoose
