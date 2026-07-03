import { useState } from 'react';

/**
 * Reusable hook for managing complex search, filter, sort, and pagination state
 * Converts state to standard query strings matching the Backend QueryBuilder
 */
export const useAdvancedSearch = (initialState = {}) => {
  const [page, setPage] = useState(initialState.page || 1);
  const [limit, setLimit] = useState(initialState.limit || 10);
  const [search, setSearch] = useState(initialState.search || '');
  const [sort, setSort] = useState(initialState.sort || '-createdAt');
  const [filters, setFilters] = useState(initialState.filters || {});

  const handlePageChange = (newPage) => setPage(newPage);
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page
  };
  const handleSearch = (keyword) => {
    setSearch(keyword);
    setPage(1);
  };
  const handleSort = (field) => setSort(field);
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };
  const clearFilters = () => {
    setFilters({});
    setSearch('');
    setPage(1);
  };

  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(search && { search }),
    ...(sort && { sort }),
    ...filters,
  }).toString();

  return {
    state: { page, limit, search, sort, filters },
    actions: { handlePageChange, handleLimitChange, handleSearch, handleSort, handleFilterChange, clearFilters },
    queryParams,
  };
};
