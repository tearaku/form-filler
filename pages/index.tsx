import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/layout'

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <Head>
          <title>公文產生機</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <h1 className="text-6xl font-bold">公文產生機</h1>
          <p className="mt-3 text-2xl">
            幫領隊生成開隊所需的公文文件(*)
          </p>

          <div className='divider'>FAQ</div>
          <div className="flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
            <div className="mt-6 w-full rounded-xl border p-6 text-left">
              <h3 className="text-2xl font-bold">功能是什麼？</h3>
              <p className="mt-4 text-xl">
                基本上就是「整合」而已。<br />
                把產生出隊伍公文的所有資料都集中在一處，然後讓領隊們按按鈕就生出所需公文、保險、入山檔案。<br />
                <div className="alert alert-warning opacity-70 shadow-lg mt-2">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>目前不支援自動填寫防疫的表格</span>
                  </div>
                </div>
              </p>
            </div>
            <div className="mt-6 w-full rounded-xl border p-6 text-left">
              <h3 className="text-2xl font-bold">介面介紹</h3>
              <p className="mt-4 text-xl">
                <div className='divider'><span className="material-icons">&#xe853;</span>個人資料</div>
                有兩個頁面，「一貫作業資料」＆「簡易資料」<br />
                - 「一貫作業資料」：跟你出隊填的一樣，凡事出隊隊員都需要填寫。 <br />
                - 「簡易資料」：給山難留守用，由於他們的資料不需要出隊隊員的那麼多，可以只填這個即可。 <br />
                <div className="alert alert-info opacity-70 shadow-lg mt-2">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>初始登入後會自動跳到此頁面，請務必記得填寫資料</span>
                  </div>
                </div>
                <div className='divider'><span className="material-icons">&#xe50a;</span>隊伍清單</div>
                - 可以檢視所有隊伍（已過期的隊伍不在內）。<br />
                - 可以在此創立新的隊伍資料。創立後，該隊領隊可以在該隊伍中得到「邀請連結」，隊伍其他人（包括山難留守）都可由此「參與」隊伍。每位隊員的職位（例：輔領、證保、等等）可在隊員加入後由領隊或輔領修改該隊員的職位。<br />
                - 隊員都齊全後，領隊或輔領可按下「產生文件」來得到所需文件。<br />
                <div className="alert alert-warning opacity-70 shadow-lg mt-2">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>生產文件前請確保有：<br />
                      領隊資料＆隊員裡有一位職位含有「證保」</span>
                  </div>
                </div>
                <div className='divider'><span className="material-icons">&#xf233;</span>幹部清單</div>
                就是幹部們<br />
                重點是：請確保「社長」職位的資料保持更新。凡事「網管」或是「社長」都可以更動這裡的資料。<br />
                交接：請社長將下一任社長新增為社長（用數字來舊新），再將自己的職位去除掉。<br />
                <div className="alert alert-warning opacity-70 shadow-lg mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>請確保有「社長」職位的人僅為一位。交接過程（同時有兩位）的狀態下生出的文件可能會有誤，請注意。</span>
                </div>
              </p>
            </div>
            <div className="mt-6 w-full rounded-xl border p-6 text-left">
              <h3 className="text-2xl font-bold">跟現有的自動化檔案有什麼差別？</h3>
              <p className="mt-4 text-xl">
                領隊：省個自己手動改公文用的資料，大概幾秒鐘吧？<br />
                隊員：省得每次出隊都要一直填一貫作業資料表。一開始寫一次後只要資料沒有更改就都不用在填了；有更動的話再去更新。
              </p>
            </div>
          </div>
        </main>

        <footer className="flex mt-4 h-24 w-full items-center justify-end border-t">
          <div className='flex items-center justify-center gap-2'>
            <p>Contact the dev</p>
            <a
              href='https://www.facebook.com/teacup1592'
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
            </a>
            <a
              href='mailto:teacup1592@gmail.com'
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" /></svg>
            </a>
          </div>
        </footer>
      </div>
    </Layout>
  )
}

export default Home
