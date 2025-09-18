
export const buildFilterQuery = (filters, userId) => {
  const query = { created_by: userId };

  // String fields with contains/equals operators
  if (filters.email) {
    if (filters.email.contains) {
      query.email = { $regex: filters.email.contains, $options: "i" };
    } else if (filters.email.equals) {
      query.email = filters.email.equals;
    }
  }

  if (filters.company) {
    if (filters.company.contains) {
      query.company = { $regex: filters.company.contains, $options: "i" };
    } else if (filters.company.equals) {
      query.company = filters.company.equals;
    }
  }

  if (filters.city) {
    if (filters.city.contains) {
      query.city = { $regex: filters.city.contains, $options: "i" };
    } else if (filters.city.equals) {
      query.city = filters.city.equals;
    }
  }

  // Enum fields with equals/in operators
  if (filters.status) {
    if (filters.status.in && Array.isArray(filters.status.in)) {
      query.status = { $in: filters.status.in };
    } else if (filters.status.equals) {
      query.status = filters.status.equals;
    }
  }

  if (filters.source) {
    if (filters.source.in && Array.isArray(filters.source.in)) {
      query.source = { $in: filters.source.in };
    } else if (filters.source.equals) {
      query.source = filters.source.equals;
    }
  }

  // Number fields with equals/gt/lt/between operators
  if (filters.score) {
    if (filters.score.equals !== undefined) {
      query.score = filters.score.equals;
    } else {
      const scoreQuery = {};
      if (filters.score.gt !== undefined) scoreQuery.$gt = filters.score.gt;
      if (filters.score.lt !== undefined) scoreQuery.$lt = filters.score.lt;
      if (filters.score.gte !== undefined) scoreQuery.$gte = filters.score.gte;
      if (filters.score.lte !== undefined) scoreQuery.$lte = filters.score.lte;
      if (
        filters.score.between &&
        Array.isArray(filters.score.between) &&
        filters.score.between.length === 2
      ) {
        scoreQuery.$gte = filters.score.between;
        scoreQuery.$lte = filters.score.between;
      }
      if (Object.keys(scoreQuery).length > 0) {
        query.score = scoreQuery;
      }
    }
  }

  if (filters.lead_value) {
    if (filters.lead_value.equals !== undefined) {
      query.lead_value = filters.lead_value.equals;
    } else {
      const valueQuery = {};
      if (filters.lead_value.gt !== undefined)
        valueQuery.$gt = filters.lead_value.gt;
      if (filters.lead_value.lt !== undefined)
        valueQuery.$lt = filters.lead_value.lt;
      if (filters.lead_value.gte !== undefined)
        valueQuery.$gte = filters.lead_value.gte;
      if (filters.lead_value.lte !== undefined)
        valueQuery.$lte = filters.lead_value.lte;
      if (
        filters.lead_value.between &&
        Array.isArray(filters.lead_value.between) &&
        filters.lead_value.between.length === 2
      ) {
        valueQuery.$gte = filters.lead_value.between;
        valueQuery.$lte = filters.lead_value.between;
      }
      if (Object.keys(valueQuery).length > 0) {
        query.lead_value = valueQuery;
      }
    }
  }

  // Date fields with on/before/after/between operators
  if (filters.created_at) {
    if (filters.created_at.on) {
      const date = new Date(filters.created_at.on);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      query.created_at = { $gte: date, $lt: nextDay };
    } else {
      const dateQuery = {};
      if (filters.created_at.before)
        dateQuery.$lt = new Date(filters.created_at.before);
      if (filters.created_at.after)
        dateQuery.$gt = new Date(filters.created_at.after);
      if (
        filters.created_at.between &&
        Array.isArray(filters.created_at.between) &&
        filters.created_at.between.length === 2
      ) {
        dateQuery.$gte = new Date(filters.created_at.between);
        dateQuery.$lte = new Date(filters.created_at.between);
      }
      if (Object.keys(dateQuery).length > 0) {
        query.created_at = dateQuery;
      }
    }
  }

  if (filters.last_activity_at) {
    if (filters.last_activity_at.on) {
      const date = new Date(filters.last_activity_at.on);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      query.last_activity_at = { $gte: date, $lt: nextDay };
    } else {
      const dateQuery = {};
      if (filters.last_activity_at.before)
        dateQuery.$lt = new Date(filters.last_activity_at.before);
      if (filters.last_activity_at.after)
        dateQuery.$gt = new Date(filters.last_activity_at.after);
      if (
        filters.last_activity_at.between &&
        Array.isArray(filters.last_activity_at.between) &&
        filters.last_activity_at.between.length === 2
      ) {
        dateQuery.$gte = new Date(filters.last_activity_at.between);
        dateQuery.$lte = new Date(filters.last_activity_at.between);
      }
      if (Object.keys(dateQuery).length > 0) {
        query.last_activity_at = dateQuery;
      }
    }
  }

  // Boolean field
  if (filters.is_qualified !== undefined) {
    query.is_qualified = filters.is_qualified;
  }

  return query;
};
