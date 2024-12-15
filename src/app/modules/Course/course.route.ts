import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseController } from './course.controller';
const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseController.createCourse,
);
router.get('/', CourseController.getAllCourses);

router.get('/:id', CourseController.getSingleCourse);

router.delete('/:id', CourseController.deleteCourse);

router.patch(
  '/:id',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseController.updateCourse,
);

export const CourseRoutes = router;
