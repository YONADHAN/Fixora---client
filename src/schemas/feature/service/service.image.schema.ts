// import * as Yup from 'yup'

// export const serviceImageSchema = Yup.object({
//   images: Yup.array()
//     .of(
//       Yup.mixed<File>()
//         .required()
//         .test('fileType', 'Only images allowed', (file) =>
//           file ? file.type.startsWith('image/') : false
//         )
//         .test('fileSize', 'Max size is 5MB', (file) =>
//           file ? file.size <= 5 * 1024 * 1024 : false
//         )
//     )
//     .length(1, 'Only one image is allowed') // ✅ ENFORCES SINGLE IMAGE
//     .required('Service image is required'),
// })
import * as Yup from 'yup'

export const serviceImageSchema = Yup.object({
  images: Yup.array()
    .of(
      Yup.mixed<File>()
        .test('fileType', 'Only images allowed', (file) =>
          file ? file.type.startsWith('image/') : true
        )
        .test('fileSize', 'Max size is 5MB', (file) =>
          file ? file.size <= 5 * 1024 * 1024 : true
        )
    )
    .max(1, 'Only one image is allowed') // ✅ still enforces 1 max
    .when('mainImage', {
      is: (mainImage: string | undefined) => !mainImage,
      then: (schema) =>
        schema
          .min(1, 'Service image is required')
          .required('Service image is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
})
