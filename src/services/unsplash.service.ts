class UnsplashService {
  static apiKey = process.env.UNSPLASH_ACCESS_KEY;
  static baseUrl = 'https://api.unsplash.com';

  static async getRandomFoodPhoto() {
    try {
      const response = await fetch(
        `${this.baseUrl}/photos/random?query=food&client_id=${this.apiKey}`
      );
      const data = await response.json();
      return data.urls.regular;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default UnsplashService;
