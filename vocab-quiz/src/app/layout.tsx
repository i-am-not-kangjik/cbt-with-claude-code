import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "강직 영단어",
  description: "품사별로 영단어를 학습하고 약점 단어를 집중 연습할 수 있는 모바일 친화적인 영어 학습 플랫폼",
  keywords: ["영단어", "영어학습", "퀴즈", "품사", "단어암기", "강직영단어"],
  authors: [{ name: "i-am-not-kangjik" }],
  openGraph: {
    title: "강직 영단어",
    description: "품사별 영단어 학습과 맞춤형 약점 단어 연습",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "강직 영단어",
    description: "품사별 영단어 학습과 맞춤형 약점 단어 연습",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="bg-gray-900 border-t border-gray-700 py-2">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-gray-400 text-xs space-y-0.5">
              <p className="font-medium">
                ✨ <span className="text-blue-400">단어 하나하나가 쌓여 완성되는 나만의 언어의 집</span> ✨
              </p>
              <p>
                Made with 💙 by{' '}
                <span className="text-blue-300 font-medium">i-am-not-kangjik</span>
              </p>
              <p>
                Contact:{' '}
                <a 
                  href="mailto:rkqqkb@gmail.com" 
                  className="text-blue-300 hover:text-blue-200 transition-colors"
                >
                  rkqqkb@gmail.com
                </a>
              </p>
              <p>
                GitHub:{' '}
                <a 
                  href="https://github.com/i-am-not-kangjik/cbt-with-claude-code" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 transition-colors"
                >
                  i-am-not-kangjik/cbt-with-claude-code
                </a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
