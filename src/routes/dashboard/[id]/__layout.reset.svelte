<script context="module" lang="ts">
import axios from "axios";
import { fade, slide } from 'svelte/transition';
import { page } from '$app/stores';
import { currentProjectID } from '@/stores'
import Transition from 'svelte-class-transition';

  export async function load({ page, fetch, session, context }) {
    const result = await axios.get("http://localhost:3333/project/" + page.params.id).then((response) => { return { status: response.status } }).catch((error) => {
      if (error.response) {
        return {
          status: error.response.status,
          error: error.response.data.message
        }
      }

      return {
        status: error.status,
        error: new Error("Backend not reachable via http://localhost:3333 on route /project/" + page.params.id)
      }
    })

    currentProjectID.set(page.params.id);

    return {
      ...result, 
      props: { 
        projectID: page.params.id
      }
    }
  }
</script>

<script lang="ts">
import { gqlGetSingleProject } from '@/generated/graphql';
import NotificationWrapper from "@/components/NotificationWrapper.svelte";

export let projectID: string;
let isMobileMenuOpen = false

const toggleMenu = () => {
  isMobileMenuOpen = !isMobileMenuOpen
}

$: query = gqlGetSingleProject({ variables: { id: projectID } })

page.subscribe(val => console.log(val))

const routes = [
  { href: `/dashboard/${ projectID }`, label: 'Dashboard', icon: 'far fa-home' }
]
</script>

<div class="h-screen flex overflow-hidden">
  <Transition toggle={ isMobileMenuOpen }>
    <div class="fixed inset-0 flex z-40 lg:hidden" role="dialog" aria-modal="true">
      <Transition toggle={ isMobileMenuOpen } transitions="transform-opacity ease-linear duration-300" inState="opacity-0" onState="opacity-100" outState="opacity-0">
        <div on:click={ toggleMenu } class="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
      </Transition>
      
      <Transition toggle={ isMobileMenuOpen } transitions="transition ease-in-out duration-300 transform" inState="-translate-x-full" onState="translate-x-0" outState="-translate-x-full">
        <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white focus:outline-none" in:slide="{{ duration: 300 }}">
          <Transition toggle={ isMobileMenuOpen } transitions="ease-in-out duration-300" inState="opacity-0" onState="opacity-100" outState="opacity-0">
            <div class="absolute top-0 right-0 -mr-12 pt-2" transition:fade>
              <button on:click={ toggleMenu } type="button" class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span class="sr-only">Close sidebar</span>
                <i class="!h-6 !w-6 text-white fal fa-times"></i>
              </button>
            </div>
          </Transition>
          
          <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div class="flex-shrink-0 flex items-center px-4">
              <svg class="h-10 w-auto text-blue-800" xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 864 864" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <g transform="translate(0.000000,864.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                  <path d="M4741 7799 c-661 -55 -1313 -348 -1740 -783 l-64 -65 -18 -108 c-10 -59 -23 -180 -29 -268 -7 -88 -15 -196 -19 -240 l-7 -80 -42 127 c-23 69 -50 167 -59 217 -10 50 -21 91 -24 91 -9 0 -98 -154 -139 -242 -301 -643 -234 -1391 192 -2131 l53 -92 6 165 c3 91 12 210 20 265 13 93 14 96 16 45 6 -133 25 -304 47 -408 l23 -112 -35 -57 c-49 -82 -127 -180 -238 -300 -89 -96 -99 -104 -126 -98 -29 7 -70 -26 -293 -237 -38 -35 -43 -37 -75 -28 l-35 10 -118 -118 c-156 -154 -363 -380 -577 -627 l-173 -200 39 -6 c22 -4 95 -12 164 -19 576 -54 1301 -215 1851 -411 369 -131 626 -252 1039 -489 549 -314 932 -478 1408 -599 203 -52 504 -122 507 -119 7 7 -172 426 -235 553 -85 172 -235 426 -363 613 -68 101 -89 138 -74 132 12 -4 72 -29 132 -55 279 -118 577 -219 888 -300 200 -51 407 -98 412 -93 2 2 -18 66 -45 143 -68 192 -157 476 -234 745 -78 273 -199 750 -192 757 4 4 299 -81 365 -105 18 -7 11 104 -25 347 -39 271 -88 498 -161 742 -3 10 3 18 16 22 18 4 21 13 21 62 0 135 -34 740 -66 1178 l-7 88 -26 -6 c-14 -4 -88 -30 -165 -58 l-138 -52 -140 138 -140 139 47 59 46 59 -45 31 c-25 18 -43 36 -40 41 10 16 290 197 392 253 202 111 414 201 695 295 l198 66 -67 90 c-89 117 -314 341 -439 435 -583 436 -1395 661 -2164 598z m539 -240 c133 -12 401 -56 412 -67 4 -4 -15 -40 -43 -80 -37 -52 -56 -71 -67 -68 -32 10 -247 45 -352 58 -130 16 -592 16 -708 0 -94 -13 -83 -4 -189 -151 -35 -47 -87 -135 -118 -196 -30 -60 -55 -101 -55 -90 0 42 52 212 90 293 45 96 142 247 164 255 19 7 276 46 336 50 108 8 425 6 530 -4z m-1184 -184 c-12 -48 -13 -49 -67 -62 -97 -25 -305 -92 -403 -132 -53 -21 -96 -37 -96 -35 0 6 172 105 259 149 86 43 313 137 318 131 1 -1 -4 -24 -11 -51z m1994 3 c318 -116 695 -349 884 -546 l39 -41 -44 -11 c-235 -59 -578 -240 -941 -495 l-148 -104 -53 24 c-422 186 -964 230 -1467 119 -160 -36 -333 -95 -478 -164 -107 -51 -150 -75 -272 -149 -43 -26 68 71 167 146 222 167 490 280 793 333 230 41 581 38 837 -5 78 -14 277 -60 308 -71 10 -4 666 576 673 596 9 24 -406 230 -463 230 -49 0 -343 -251 -470 -400 l-38 -45 44 84 c50 98 127 208 212 304 67 76 262 237 286 237 9 0 68 -19 131 -42z m-843 -1322 c233 -49 436 -132 613 -250 174 -116 351 -287 319 -307 -22 -14 -636 -274 -804 -341 -46 -18 -48 -18 -34 -1 9 10 69 85 133 167 l118 149 -54 34 c-225 145 -622 273 -998 325 -141 19 -492 16 -608 -5 -50 -9 -95 -17 -100 -17 -13 1 85 59 178 105 97 50 251 103 372 129 169 37 267 45 508 42 206 -4 250 -7 357 -30z m1237 -728 c15 -117 38 -423 43 -585 l6 -181 -44 -6 c-24 -3 -64 -8 -89 -10 -25 -3 -73 -8 -107 -12 l-63 -7 0 34 c0 19 -7 126 -15 239 -8 113 -15 208 -15 212 0 4 -133 9 -296 10 l-295 3 428 172 c235 94 431 172 435 172 4 1 9 -18 12 -41z m115 -1125 c48 -151 76 -281 96 -453 8 -69 15 -128 15 -131 0 -9 -84 8 -161 33 l-68 22 -6 65 c-18 208 -50 340 -112 474 -20 42 -34 79 -32 81 6 5 170 34 201 35 25 1 28 -5 67 -126z m-523 41 c-4 -14 -18 -43 -32 -63 l-25 -38 -92 19 c-51 10 -128 30 -172 45 l-80 27 40 8 c37 7 236 23 329 27 36 1 38 0 32 -25z m-1050 -85 c326 -140 752 -284 1054 -354 41 -10 78 -20 82 -24 3 -3 27 -109 53 -234 84 -417 188 -834 306 -1225 27 -89 49 -167 49 -171 0 -9 -169 50 -360 127 -268 108 -920 395 -920 405 0 2 28 0 63 -4 135 -16 346 -20 466 -10 69 6 126 12 127 14 3 3 -87 481 -128 676 -19 93 -38 160 -47 169 -9 7 -83 57 -166 111 -191 124 -396 278 -555 418 -134 118 -169 153 -153 153 6 0 64 -23 129 -51z m-1750 -975 c216 -92 425 -205 644 -349 199 -131 284 -198 508 -403 345 -317 559 -493 764 -630 118 -79 322 -194 326 -183 3 8 -50 287 -75 401 -8 34 42 -30 150 -196 157 -240 371 -634 348 -642 -16 -5 -305 77 -473 134 -328 113 -611 249 -1048 504 -550 321 -786 439 -1141 569 -363 132 -917 267 -1262 307 -31 4 -59 9 -61 13 -11 18 337 411 363 411 9 0 68 -14 131 -30 633 -166 1351 -524 1958 -977 131 -98 134 -95 37 27 -247 309 -645 657 -1110 968 -93 63 -172 116 -174 118 -11 10 17 0 115 -42z"/>
                </g>
              </svg>
              <span class="text-gray-800 font-bold text-2xl ml-1">wolf</span>
            </div>
            <nav aria-label="Sidebar" class="mt-5">
              <div class="px-2 space-y-1">
                {#each routes as route }
                <a href={ route.href } class="group flex items-center px-2 py-2 text-base font-medium rounded-md { route.href === $page.path ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900" }">
                  <i class="mr-4 !h-6 !w-6 { route.icon } { route.href === $page.path ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500" } "></i>
                  { route.label }
                </a>
                {/each}
              </div>
            </nav>
          </div>
          <div class="flex-shrink-0 flex border-t border-gray-200 p-4 { $page.path.includes(`/dashboard/${ projectID }/settings`) ? "bg-gray-100 text-gray-900" : "" }">
            <a href="/dashboard/{ projectID }/settings" class="flex-shrink-0 group block">
              <div class="flex items-center">
                <div>
                  <img class="inline-block h-10 w-10 rounded" src={ $query.data?.project?.avatar } alt="">
                </div>
                <div class="ml-3">
                  <p class="text-base font-medium text-gray-700 group-hover:text-gray-900">
                    { $query.data?.project?.name }
                  </p>
                  <p class="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                    Open project settings
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </Transition>
      
      <div class="flex-shrink-0 w-14" aria-hidden="true">
        <!-- Force sidebar to shrink to fit close icon -->
      </div>
    </div>
  </Transition>
    
  <!-- Static sidebar for desktop -->
  <div class="hidden lg:flex lg:flex-shrink-0">
    <div class="flex flex-col w-64">
      <!-- Sidebar component, might swap this element with another sidebar later -->
      <div class="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-gray-100">
        <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center flex-shrink-0 px-4">
            <svg class="h-10 w-auto text-blue-700" xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 864 864" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0.000000,864.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                <path d="M4741 7799 c-661 -55 -1313 -348 -1740 -783 l-64 -65 -18 -108 c-10 -59 -23 -180 -29 -268 -7 -88 -15 -196 -19 -240 l-7 -80 -42 127 c-23 69 -50 167 -59 217 -10 50 -21 91 -24 91 -9 0 -98 -154 -139 -242 -301 -643 -234 -1391 192 -2131 l53 -92 6 165 c3 91 12 210 20 265 13 93 14 96 16 45 6 -133 25 -304 47 -408 l23 -112 -35 -57 c-49 -82 -127 -180 -238 -300 -89 -96 -99 -104 -126 -98 -29 7 -70 -26 -293 -237 -38 -35 -43 -37 -75 -28 l-35 10 -118 -118 c-156 -154 -363 -380 -577 -627 l-173 -200 39 -6 c22 -4 95 -12 164 -19 576 -54 1301 -215 1851 -411 369 -131 626 -252 1039 -489 549 -314 932 -478 1408 -599 203 -52 504 -122 507 -119 7 7 -172 426 -235 553 -85 172 -235 426 -363 613 -68 101 -89 138 -74 132 12 -4 72 -29 132 -55 279 -118 577 -219 888 -300 200 -51 407 -98 412 -93 2 2 -18 66 -45 143 -68 192 -157 476 -234 745 -78 273 -199 750 -192 757 4 4 299 -81 365 -105 18 -7 11 104 -25 347 -39 271 -88 498 -161 742 -3 10 3 18 16 22 18 4 21 13 21 62 0 135 -34 740 -66 1178 l-7 88 -26 -6 c-14 -4 -88 -30 -165 -58 l-138 -52 -140 138 -140 139 47 59 46 59 -45 31 c-25 18 -43 36 -40 41 10 16 290 197 392 253 202 111 414 201 695 295 l198 66 -67 90 c-89 117 -314 341 -439 435 -583 436 -1395 661 -2164 598z m539 -240 c133 -12 401 -56 412 -67 4 -4 -15 -40 -43 -80 -37 -52 -56 -71 -67 -68 -32 10 -247 45 -352 58 -130 16 -592 16 -708 0 -94 -13 -83 -4 -189 -151 -35 -47 -87 -135 -118 -196 -30 -60 -55 -101 -55 -90 0 42 52 212 90 293 45 96 142 247 164 255 19 7 276 46 336 50 108 8 425 6 530 -4z m-1184 -184 c-12 -48 -13 -49 -67 -62 -97 -25 -305 -92 -403 -132 -53 -21 -96 -37 -96 -35 0 6 172 105 259 149 86 43 313 137 318 131 1 -1 -4 -24 -11 -51z m1994 3 c318 -116 695 -349 884 -546 l39 -41 -44 -11 c-235 -59 -578 -240 -941 -495 l-148 -104 -53 24 c-422 186 -964 230 -1467 119 -160 -36 -333 -95 -478 -164 -107 -51 -150 -75 -272 -149 -43 -26 68 71 167 146 222 167 490 280 793 333 230 41 581 38 837 -5 78 -14 277 -60 308 -71 10 -4 666 576 673 596 9 24 -406 230 -463 230 -49 0 -343 -251 -470 -400 l-38 -45 44 84 c50 98 127 208 212 304 67 76 262 237 286 237 9 0 68 -19 131 -42z m-843 -1322 c233 -49 436 -132 613 -250 174 -116 351 -287 319 -307 -22 -14 -636 -274 -804 -341 -46 -18 -48 -18 -34 -1 9 10 69 85 133 167 l118 149 -54 34 c-225 145 -622 273 -998 325 -141 19 -492 16 -608 -5 -50 -9 -95 -17 -100 -17 -13 1 85 59 178 105 97 50 251 103 372 129 169 37 267 45 508 42 206 -4 250 -7 357 -30z m1237 -728 c15 -117 38 -423 43 -585 l6 -181 -44 -6 c-24 -3 -64 -8 -89 -10 -25 -3 -73 -8 -107 -12 l-63 -7 0 34 c0 19 -7 126 -15 239 -8 113 -15 208 -15 212 0 4 -133 9 -296 10 l-295 3 428 172 c235 94 431 172 435 172 4 1 9 -18 12 -41z m115 -1125 c48 -151 76 -281 96 -453 8 -69 15 -128 15 -131 0 -9 -84 8 -161 33 l-68 22 -6 65 c-18 208 -50 340 -112 474 -20 42 -34 79 -32 81 6 5 170 34 201 35 25 1 28 -5 67 -126z m-523 41 c-4 -14 -18 -43 -32 -63 l-25 -38 -92 19 c-51 10 -128 30 -172 45 l-80 27 40 8 c37 7 236 23 329 27 36 1 38 0 32 -25z m-1050 -85 c326 -140 752 -284 1054 -354 41 -10 78 -20 82 -24 3 -3 27 -109 53 -234 84 -417 188 -834 306 -1225 27 -89 49 -167 49 -171 0 -9 -169 50 -360 127 -268 108 -920 395 -920 405 0 2 28 0 63 -4 135 -16 346 -20 466 -10 69 6 126 12 127 14 3 3 -87 481 -128 676 -19 93 -38 160 -47 169 -9 7 -83 57 -166 111 -191 124 -396 278 -555 418 -134 118 -169 153 -153 153 6 0 64 -23 129 -51z m-1750 -975 c216 -92 425 -205 644 -349 199 -131 284 -198 508 -403 345 -317 559 -493 764 -630 118 -79 322 -194 326 -183 3 8 -50 287 -75 401 -8 34 42 -30 150 -196 157 -240 371 -634 348 -642 -16 -5 -305 77 -473 134 -328 113 -611 249 -1048 504 -550 321 -786 439 -1141 569 -363 132 -917 267 -1262 307 -31 4 -59 9 -61 13 -11 18 337 411 363 411 9 0 68 -14 131 -30 633 -166 1351 -524 1958 -977 131 -98 134 -95 37 27 -247 309 -645 657 -1110 968 -93 63 -172 116 -174 118 -11 10 17 0 115 -42z"/>
              </g>
            </svg>
            <span class="text-gray-800 font-bold text-2xl ml-1">wolf</span>
          </div>
          <nav class="mt-5 flex-1" aria-label="Sidebar">
            <div class="px-2 space-y-1">
              {#each routes as route }
              <a href={ route.href } class="group flex items-center px-2 py-2 text-sm font-medium rounded-md { route.href === $page.path ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900" }">
                <i class="text-gray-500 mr-3 !h-6 !w-6 { route.icon } { route.href === $page.path ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500" }"></i>
                { route.label }
              </a>
              {/each}
            </div>
          </nav>
        </div>
        <div class="flex-shrink-0 flex border-t border-gray-200 p-4 { $page.path.includes(`/dashboard/${ projectID }/settings`) ? "bg-gray-200 text-gray-900" : "" }">
          <a href="/dashboard/{ projectID }/settings" class="flex-shrink-0 w-full group block">
            <div class="flex items-center">
              <div>
                <img class="inline-block h-9 w-9 rounded" src={ $query.data?.project?.avatar } alt="">
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  { $query.data?.project?.name }
                </p>
                <p class="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  Open project settings
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col min-w-0 flex-1 overflow-hidden">
    <div class="lg:hidden">
      <div class="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-1.5">
        <div>
          <svg class="h-10 w-auto text-blue-700" xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 864 864" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <g transform="translate(0.000000,864.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
              <path d="M4741 7799 c-661 -55 -1313 -348 -1740 -783 l-64 -65 -18 -108 c-10 -59 -23 -180 -29 -268 -7 -88 -15 -196 -19 -240 l-7 -80 -42 127 c-23 69 -50 167 -59 217 -10 50 -21 91 -24 91 -9 0 -98 -154 -139 -242 -301 -643 -234 -1391 192 -2131 l53 -92 6 165 c3 91 12 210 20 265 13 93 14 96 16 45 6 -133 25 -304 47 -408 l23 -112 -35 -57 c-49 -82 -127 -180 -238 -300 -89 -96 -99 -104 -126 -98 -29 7 -70 -26 -293 -237 -38 -35 -43 -37 -75 -28 l-35 10 -118 -118 c-156 -154 -363 -380 -577 -627 l-173 -200 39 -6 c22 -4 95 -12 164 -19 576 -54 1301 -215 1851 -411 369 -131 626 -252 1039 -489 549 -314 932 -478 1408 -599 203 -52 504 -122 507 -119 7 7 -172 426 -235 553 -85 172 -235 426 -363 613 -68 101 -89 138 -74 132 12 -4 72 -29 132 -55 279 -118 577 -219 888 -300 200 -51 407 -98 412 -93 2 2 -18 66 -45 143 -68 192 -157 476 -234 745 -78 273 -199 750 -192 757 4 4 299 -81 365 -105 18 -7 11 104 -25 347 -39 271 -88 498 -161 742 -3 10 3 18 16 22 18 4 21 13 21 62 0 135 -34 740 -66 1178 l-7 88 -26 -6 c-14 -4 -88 -30 -165 -58 l-138 -52 -140 138 -140 139 47 59 46 59 -45 31 c-25 18 -43 36 -40 41 10 16 290 197 392 253 202 111 414 201 695 295 l198 66 -67 90 c-89 117 -314 341 -439 435 -583 436 -1395 661 -2164 598z m539 -240 c133 -12 401 -56 412 -67 4 -4 -15 -40 -43 -80 -37 -52 -56 -71 -67 -68 -32 10 -247 45 -352 58 -130 16 -592 16 -708 0 -94 -13 -83 -4 -189 -151 -35 -47 -87 -135 -118 -196 -30 -60 -55 -101 -55 -90 0 42 52 212 90 293 45 96 142 247 164 255 19 7 276 46 336 50 108 8 425 6 530 -4z m-1184 -184 c-12 -48 -13 -49 -67 -62 -97 -25 -305 -92 -403 -132 -53 -21 -96 -37 -96 -35 0 6 172 105 259 149 86 43 313 137 318 131 1 -1 -4 -24 -11 -51z m1994 3 c318 -116 695 -349 884 -546 l39 -41 -44 -11 c-235 -59 -578 -240 -941 -495 l-148 -104 -53 24 c-422 186 -964 230 -1467 119 -160 -36 -333 -95 -478 -164 -107 -51 -150 -75 -272 -149 -43 -26 68 71 167 146 222 167 490 280 793 333 230 41 581 38 837 -5 78 -14 277 -60 308 -71 10 -4 666 576 673 596 9 24 -406 230 -463 230 -49 0 -343 -251 -470 -400 l-38 -45 44 84 c50 98 127 208 212 304 67 76 262 237 286 237 9 0 68 -19 131 -42z m-843 -1322 c233 -49 436 -132 613 -250 174 -116 351 -287 319 -307 -22 -14 -636 -274 -804 -341 -46 -18 -48 -18 -34 -1 9 10 69 85 133 167 l118 149 -54 34 c-225 145 -622 273 -998 325 -141 19 -492 16 -608 -5 -50 -9 -95 -17 -100 -17 -13 1 85 59 178 105 97 50 251 103 372 129 169 37 267 45 508 42 206 -4 250 -7 357 -30z m1237 -728 c15 -117 38 -423 43 -585 l6 -181 -44 -6 c-24 -3 -64 -8 -89 -10 -25 -3 -73 -8 -107 -12 l-63 -7 0 34 c0 19 -7 126 -15 239 -8 113 -15 208 -15 212 0 4 -133 9 -296 10 l-295 3 428 172 c235 94 431 172 435 172 4 1 9 -18 12 -41z m115 -1125 c48 -151 76 -281 96 -453 8 -69 15 -128 15 -131 0 -9 -84 8 -161 33 l-68 22 -6 65 c-18 208 -50 340 -112 474 -20 42 -34 79 -32 81 6 5 170 34 201 35 25 1 28 -5 67 -126z m-523 41 c-4 -14 -18 -43 -32 -63 l-25 -38 -92 19 c-51 10 -128 30 -172 45 l-80 27 40 8 c37 7 236 23 329 27 36 1 38 0 32 -25z m-1050 -85 c326 -140 752 -284 1054 -354 41 -10 78 -20 82 -24 3 -3 27 -109 53 -234 84 -417 188 -834 306 -1225 27 -89 49 -167 49 -171 0 -9 -169 50 -360 127 -268 108 -920 395 -920 405 0 2 28 0 63 -4 135 -16 346 -20 466 -10 69 6 126 12 127 14 3 3 -87 481 -128 676 -19 93 -38 160 -47 169 -9 7 -83 57 -166 111 -191 124 -396 278 -555 418 -134 118 -169 153 -153 153 6 0 64 -23 129 -51z m-1750 -975 c216 -92 425 -205 644 -349 199 -131 284 -198 508 -403 345 -317 559 -493 764 -630 118 -79 322 -194 326 -183 3 8 -50 287 -75 401 -8 34 42 -30 150 -196 157 -240 371 -634 348 -642 -16 -5 -305 77 -473 134 -328 113 -611 249 -1048 504 -550 321 -786 439 -1141 569 -363 132 -917 267 -1262 307 -31 4 -59 9 -61 13 -11 18 337 411 363 411 9 0 68 -14 131 -30 633 -166 1351 -524 1958 -977 131 -98 134 -95 37 27 -247 309 -645 657 -1110 968 -93 63 -172 116 -174 118 -11 10 17 0 115 -42z"/>
            </g>
          </svg>
        </div>
        <div>
          <button on:click="{ toggleMenu }" type="button" class="-mr-3 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900">
            <span class="sr-only">Open sidebar</span>
            <i class="!h-6 !w-6 fal fa-bars"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="flex-1 relative z-0 flex overflow-hidden">
      <slot></slot>
    </div>
  </div>
</div>

<NotificationWrapper></NotificationWrapper>