import { Controller, Post, Body } from '@nestjs/common';
import { SearchSuggestionsService } from './search-suggestions.service';

@Controller('search-suggestions')
export class SearchSuggestionsController {
  constructor(private readonly searchSuggestionsService: SearchSuggestionsService) {}

  @Post()
  async getSuggestions(@Body('search') search_text: string ) { 
    return this.searchSuggestionsService.getSuggestionsFor(search_text);
  }
}
