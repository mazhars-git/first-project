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
router.patch(
  '/:id',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseController.updateCourse,
);
router.get('/', CourseController.getAllCourses);

router.get('/:id', CourseController.getSingleCourse);

router.put('/:courseId/assign-faculties', CourseController.getSingleCourse);

router.delete('/:id', CourseController.deleteCourse);

export const CourseRoutes = router;
