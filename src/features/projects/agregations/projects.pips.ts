/* eslint-disable @typescript-eslint/camelcase */
export const userCompaniesStages = (
  userId: string,
  limit?: number,
  skip?: number,
): Array<any> => [
  {
    $match: { admins: userId },
  },
  // nested created By
  {
    $lookup: {
      from: 'users',
      localField: 'createdBy',
      foreignField: '_id',
      as: 'createdBy',
    },
  },
  // nested last Updated By
  {
    $lookup: {
      from: 'users',
      localField: 'lastUpdatedBy',
      foreignField: '_id',
      as: 'lastUpdatedBy',
    },
  },
  // nested admins
  {
    $lookup: {
      from: 'users',
      localField: 'admins',
      foreignField: '_id',
      as: 'admins',
    },
  },
  // // paginate the results
  { $sort: { createdAt: -1 } },
  {
    $group: {
      _id: null,
      docs: { $push: '$$ROOT' },
      totalCount: { $sum: 1 },
    },
  },
  limit
    ? {
        $project: { _id: 0, totalCount: 1, docs: { $slice: ['$docs', limit] } },
      }
    : { $project: { _id: 0, totalCount: 1, docs: '$docs' } },
  {
    $skip: skip || 0,
  },
];

export const userCompaniesProjectsStages = (
  userId: string,
  limit?: number,
  skip?: number,
): Array<any> => [
  // start with company collection
  // get user's companies
  {
    $match: { admins: userId },
  },
  // apply right join with projects
  {
    $lookup: {
      from: 'projects',
      let: { id: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$company', { $toObjectId: '$$id' }] } } },
      ],
      as: 'projects',
    },
  },
  // unwind company's projects to regroup them in next stage
  {
    $unwind: {
      path: '$projects',
      preserveNullAndEmptyArrays: false,
    },
  },
  // regroup result by projects
  {
    $group: {
      _id: '$projects',
    },
  },
  // apply left join with products
  {
    $lookup: {
      from: 'products',
      localField: '_id.products',
      foreignField: '_id',
      as: '_id.products',
    },
  },
  // apply left join with categories
  {
    $lookup: {
      from: 'project_categories',
      localField: '_id.categories',
      foreignField: '_id',
      as: '_id.categories',
    },
  },
  // apply left join with country
  {
    $lookup: {
      from: 'countries',
      localField: '_id.country',
      foreignField: '_id',
      as: '_id.country',
    },
  },
  // rebuild result structur
  {
    $project: {
      _id: '$_id._id',
      isActivated: '$_id.isActivated',
      categories: '$_id.categories',
      products: '$_id.products',
      name: '$_id.name',
      city: '$_id.city',
      address: '$_id.address',
      state: '$_id.state',
      areaTotal: '$_id.areaTotal',
      currency: '$_id.currency',
      company: '$_id.company',
      country: '$_id.country',
      createdAt: '$_id.createdAt',
      updatedAt: '$_id.updatedAt',
    },
  },
  // // paginate the results
  { $sort: { 'project.createdAt': -1 } },
  {
    $group: {
      _id: null,
      docs: { $push: '$$ROOT' },
      totalCount: { $sum: 1 },
    },
  },
  limit
    ? {
        $project: { _id: 0, totalCount: 1, docs: { $slice: ['$docs', limit] } },
      }
    : { $project: { _id: 0, totalCount: 1, docs: '$docs' } },
  {
    $skip: skip || 0,
  },
];
