import Link from "next/link";
import { getCachedHomePageArticles } from "@/lib/cache/articles";
import Pagination from "@/components/common/Pagination";
import HeaderBannerAd from "@/components/ads/HeaderBannerAd";
import SidebarAd from "@/components/ads/SidebarAd";
import StickyFloatingAd from "@/components/ads/StickyFloatingAd";
import { ArrowRight, BookOpen, Clock, Folder, TrendingUp, User, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const revalidate = 3600;

function isValidImageUrl(url: string | null | undefined): url is string {
  return !!url && (url.startsWith("http://") || url.startsWith("https://"));
}

interface HomePageProps {
  searchParams?: { page?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const currentPage = Math.max(1, parseInt(searchParams?.page || "1", 10) || 1);
  const homeData = await getCachedHomePageArticles(currentPage, 8);

  const { featuredArticles, recentArticles, categories, totalPublishedCount, totalPages } = homeData;

  return (
    <div className="mx-auto max-w-7xl px-0 pb-20 pt-2 sm:px-6 sm:py-8">
      <HeaderBannerAd />

      <div className="flex flex-col gap-5 lg:flex-row lg:gap-8">
        <div className="w-full min-w-0 space-y-5 sm:space-y-8">
          <section className="w-full space-y-4 border-y border-gray-200/80 bg-white px-4 py-5 text-left shadow-sm dark:border-gray-800/80 dark:bg-gray-900 sm:rounded-2xl sm:border sm:p-8 sm:text-center">
            <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Plataforma Editorial Abierta</span>
            </div>

            <h1 className="font-serif text-2xl font-black leading-[1.16] tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-[40px]">
              Historias que inspiran,
              <br className="hidden sm:inline" /> conocimiento que transforma
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:mx-auto sm:text-base">
              Descubre articulos de calidad redactados por autores expertos en diversas materias.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-medium text-gray-600 dark:text-gray-400 sm:justify-center sm:text-xs">
              <span className="inline-flex items-center space-x-2 rounded-lg border border-gray-200/80 bg-gray-50 px-3 py-1.5 dark:border-gray-700/60 dark:bg-gray-800/60">
                <BookOpen className="h-3.5 w-3.5 text-brand-500" />
                <span>{totalPublishedCount} historias publicadas</span>
              </span>
              <span className="inline-flex items-center space-x-2 rounded-lg border border-gray-200/80 bg-gray-50 px-3 py-1.5 dark:border-gray-700/60 dark:bg-gray-800/60">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Lectura rapida</span>
              </span>
            </div>
          </section>

          {categories.length > 0 && (
            <section className="flex w-full gap-2 overflow-x-auto border-y border-gray-200/80 px-4 py-3 dark:border-gray-800/80 sm:flex-wrap sm:justify-center sm:px-0">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="inline-flex shrink-0 items-center space-x-1.5 rounded-full bg-gray-100 px-3.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Folder className="h-3 w-3 opacity-60" />
                  <span>{cat.name}</span>
                </Link>
              ))}
            </section>
          )}

          {featuredArticles.length > 0 && (
            <section className="space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between px-4 sm:px-0">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                    Lo mas destacado
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                {featuredArticles.map((art, idx) => (
                  <article
                    key={art.id}
                    className={`group flex flex-col overflow-hidden border-y border-gray-200 bg-white shadow-sm transition hover:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-600 sm:rounded-2xl sm:border ${
                      idx === 0 ? "md:col-span-2" : ""
                    }`}
                  >
                    {art.featuredImage && isValidImageUrl(art.featuredImage) && (
                      <Link
                        href={`/stories/${art.slug}`}
                        className={`relative block overflow-hidden bg-gray-100 dark:bg-gray-800 ${
                          idx === 0 ? "h-48 sm:h-72" : "h-40"
                        }`}
                      >
                        <img
                          src={art.featuredImage}
                          alt={art.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </Link>
                    )}
                    <div className="flex flex-grow flex-col justify-between space-y-3 p-4 sm:p-5">
                      <div className="space-y-1.5">
                        {art.category && (
                          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                            {art.category.name}
                          </span>
                        )}
                        <h3 className={`font-serif font-bold leading-snug text-gray-900 transition group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300 ${idx === 0 ? "text-xl sm:text-2xl" : "text-[17px] sm:text-base"}`}>
                          <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                        </h3>
                        <p className="line-clamp-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{art.excerpt}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-medium text-gray-500 dark:border-gray-800">
                        <Link href={`/author/${art.author.username}`} className="flex min-w-0 items-center space-x-1.5 font-semibold hover:text-gray-900 dark:hover:text-white">
                          <User className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{art.author.name}</span>
                        </Link>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span>{art.readingTime} min</span>
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-4 sm:space-y-5">
            <div className="flex items-center space-x-2 px-4 sm:px-0">
              <BookOpen className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                Ultimas publicaciones
              </h2>
            </div>

            {recentArticles.length === 0 ? (
              <div className="border border-dashed border-gray-300 bg-white py-12 text-center dark:border-gray-800 dark:bg-gray-900 sm:rounded-2xl">
                <p className="text-gray-500">No hay publicaciones publicas disponibles por el momento.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  {recentArticles.map((art) => (
                    <article
                      key={art.id}
                      className="flex flex-col gap-3.5 border-y border-gray-200 bg-white p-3.5 shadow-sm transition hover:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-600 sm:flex-row sm:gap-4 sm:rounded-2xl sm:border sm:p-5"
                    >
                      {art.featuredImage && isValidImageUrl(art.featuredImage) && (
                        <Link
                          href={`/stories/${art.slug}`}
                          className="block h-40 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 sm:h-24 sm:w-32 sm:rounded-xl"
                        >
                          <img
                            src={art.featuredImage}
                            alt={art.title}
                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          />
                        </Link>
                      )}
                      <div className="flex min-w-0 flex-grow flex-col justify-between space-y-1.5">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                            <Link href={`/author/${art.author.username}`} className="font-semibold text-gray-900 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-300">
                              {art.author.name}
                            </Link>
                            <span>&bull;</span>
                            <span suppressHydrationWarning>{art.publishedAt ? formatDistanceToNow(new Date(art.publishedAt), { addSuffix: true, locale: es }) : ""}</span>
                            {art.category && (
                              <>
                                <span>&bull;</span>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">{art.category.name}</span>
                              </>
                            )}
                          </div>
                          <h3 className="line-clamp-2 font-serif text-[17px] font-bold leading-snug text-gray-900 transition hover:text-gray-600 dark:text-white dark:hover:text-gray-300 sm:text-base">
                            <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                          </h3>
                          <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">{art.excerpt}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span>{art.readingTime} min</span>
                          </span>
                          <Link href={`/stories/${art.slug}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                            <span>Leer articulo</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/" />
              </div>
            )}
          </section>
        </div>

        <aside className="w-full flex-shrink-0 px-4 lg:w-[300px] lg:px-0">
          <SidebarAd />
        </aside>
      </div>

      <StickyFloatingAd />
    </div>
  );
}
