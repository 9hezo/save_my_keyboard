'use strict';

require('dotenv').config();

class PaginationManager {
  constructor(page, count_all) {
    const PAGE_LIMIT = parseInt(process.env.PAGE_LIMIT);
    const SECTION_LIMIT = parseInt(process.env.SECTION_LIMIT);

    this.page = page;
    this.total_page = parseInt(count_all / PAGE_LIMIT) + (count_all % PAGE_LIMIT != 0 ? 1 : 0);
    this.start_page = parseInt((this.page - 1) / SECTION_LIMIT) * SECTION_LIMIT;

    if (this.start_page % SECTION_LIMIT === 0) {
      this.start_page += 1;
    }

    this.end_page = this.start_page + SECTION_LIMIT - 1;
    if (this.end_page > this.total_page) {
      this.end_page = this.total_page;
    }
  }

  render() {
    return { page: this.page, total_page: this.total_page, start_page: this.start_page, end_page: this.end_page };
  }
}

module.exports = PaginationManager;
