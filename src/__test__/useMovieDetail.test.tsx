import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";  // ✅ import Vitest globals
import { useMovieDetail } from "../hooks/useMovieDetail";
import * as moviesApi from "../api/movies";

// Mock API response
const mockMovieDetail = {
  id: 1,
  title: "Inception",
  genre: "Sci-Fi",
  release_year: 2010,
  description: "A mind-bending thriller",
  ratings_count: 10,
  ratings_avg: 4.5,
  created_by: 1,
  created_by_username: "admin",
  created_at: "2025-01-01",
  recent_ratings: [],
};

describe("useMovieDetail hook", () => {
  it("fetches and sets movie details", async () => {
    // Mock getMovieDetail API
    vi.spyOn(moviesApi, "getMovieDetail").mockResolvedValue(mockMovieDetail);

    const { result } = renderHook(() => useMovieDetail(1));

    // Run fetch
    await act(async () => {
      await result.current.fetchMovieDetail();
    });

    // Assertions
    expect(result.current.movie).toEqual(mockMovieDetail);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
