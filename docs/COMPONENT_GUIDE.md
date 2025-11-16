# Product Card Component Guide

This document outlines the different product card components used throughout the website to showcase menu items and drinks.

### 1. The "Standard" Drink Card

This is the most common card, but it is defined locally in several different files. 

- **Appearance**: A yellow card with a large product image, name, description, star rating, price, and a link button.
- **Files where it's defined and used**:
    - `src/app/(microsite)/[slug]/(components)/MenuShowcaseSection.tsx`
    - `src/app/(microsite)/[slug]/(components)/PopularProductsCarousel.tsx`
    - `src/components/home/MenuShowcase.tsx`

### 2. Featured Drinks Card (`MenuItemCard.tsx`)

This card is used on the homepage in the "Popular Products" carousel and on the main menu page. It has a distinct visual style with the product image appearing to float above the card details.

- **Appearance**: A beige card with a large, rotated product image that "floats" above the card content. It includes the name, price, rating, and a link button.
- **File where it's defined**: `src/components/menu/MenuItemCard.tsx`
- **File where it's used**: 
    - `src/components/home/FeaturedDrinks.tsx`
    - `src/components/menu/MenuCarousel.tsx`

### 3. Menu Showcase Card (`MenuShowcaseCard.tsx`) - **Unused**

This card was likely intended for the homepage's "Our Menu" section but is not currently implemented.

- **Appearance**: A black card with a white border, a contained product image, name, description, price, and a link button.
- **File where it's defined**: `src/components/home/MenuShowcaseCard.tsx`
- **Status**: **Not currently used in the application.**

### 4. Promotion Cards

These cards are specifically designed to highlight promotions on the main menu page.

- **`BigPromotionCard.tsx`**: A large, single-column card for a featured promotion.
- **`PromotionCard.tsx`**: A smaller card used in a two-column grid.
- **`PromotionCarouselCard.tsx`**: A card similar to the "Featured Drinks" card, used in a carousel for additional offers.
- **File where they're used**: All are used within `src/components/menu/MenuPromotions.tsx`.
