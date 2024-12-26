import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { OfferedCourseController } from './offeredCourse.controller';
const router = express.Router();

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseController.createOfferedCourse,
);

router.get('/', OfferedCourseController.getAllOfferedCourse);

router.patch(
  '/:id',
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseController.updateOfferedCourse,
);

// router.get('/', CourseController.getAllCourses);

// router.get('/:id', CourseController.getSingleCourse);

// router.put(
//   '/:courseId/assign-faculties',
//   validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
//   CourseController.assignFacultiesWithCourse,
// );

// router.delete(
//   '/:courseId/remove-faculties',
//   validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
//   CourseController.removeFacultiesWithCourse,
// );

// router.delete('/:id', CourseController.deleteCourse);

export const OfferedCourseRoutes = router;
