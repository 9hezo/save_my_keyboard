'use strict';

class TokensRepository {
  constructor(tokensModel) {
    this.tokensModel = tokensModel;
  }

  saveToken = async (refreshToken, userId) => {
    try {
      const result = await this.tokensModel.create({ refreshToken, userId });
      return result.id;
    } catch (err) {
      console.log(err);
      return -1;
    }
  };
}

module.exports = TokensRepository;
