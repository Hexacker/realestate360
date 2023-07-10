import mongoose from 'mongoose';

export const companyAdmins = async (
  companyId: string,
  limit?: number,
  skip?: number,
): Promise<any[]> => {
  return [
    {
      $match: {
        _id: mongoose.Types.ObjectId(companyId),
      },
    },
    {
      $project: {
        admins: 1,
        _id: 0,
        totalCount: {
          $cond: {
            if: {
              $isArray: '$admins',
            },
            then: {
              $size: '$admins',
            },
            else: 'NA',
          },
        },
      },
    },
    {
      $unwind: {
        path: '$admins',
        preserveNullAndEmptyArrays: false,
      },
    },

    {
      $lookup: {
        from: 'users',
        localField: 'admins',
        foreignField: '_id',
        as: 'admin',
      },
    },
    {
      $project: {
        admin: 1,
        totalCount: 1,
      },
    },
    limit
      ? {
          $limit: limit,
        }
      : {
          $skip: 0,
        },
    {
      $skip: skip || 0,
    },
    {
      $unwind: {
        path: '$admin',
        preserveNullAndEmptyArrays: false,
      },
    },

    {
      $lookup: {
        from: 'roles',
        localField: 'admin.roles',
        foreignField: '_id',
        as: 'admin.roles',
      },
    },
    // {
    //   $unset: 'admin.password',
    // },
  ];
};
