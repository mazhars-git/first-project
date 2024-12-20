import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseController } from './course.controller';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post(
  '/create-course',
  auth('admin'),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseController.createCourse,
);
router.patch(
  '/:id',
  auth('admin'),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseController.updateCourse,
);
router.get('/', CourseController.getAllCourses);

router.get('/:id', CourseController.getSingleCourse);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseController.assignFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseController.removeFacultiesWithCourse,
);

router.delete('/:id', CourseController.deleteCourse);

export const CourseRoutes = router;
