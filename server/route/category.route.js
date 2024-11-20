import { Router } from 'express'
import auth from '../middleware/auth.js'
import { AddCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from '../controllers/category.controller.js'

const categoryRouter = Router()

categoryRouter.post("/add-category",auth,AddCategoryController)
categoryRouter.get('/get',getCategoryController)
categoryRouter.put('/update',auth,updateCategoryController)
categoryRouter.delete("/delete",auth,deleteCategoryController)

export default categoryRouter