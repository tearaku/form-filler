import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react"

import AccessDenied from "../../components/access-denied"
import Image from "next/image";
import Layout from "../../components/layout"
import { authOptions } from "../api/auth/[...nextauth]"

import img_1 from "../../public/tutorial/import_equip/1.png"
import img_2 from "../../public/tutorial/import_equip/2.png"
import img_3 from "../../public/tutorial/import_equip/3.png"

import { GetServerSideProps } from "next";

export default function ImportEquipTutorial() {
  const { data: session, status } = useSession();

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="divider">
        <h1>裝備匯入教學</h1>
      </div>
      <main>
        <ol>
          <li>1. 把裝備列表複製到新的 worksheet 上</li>
          <ol>
            <li>1.1. 請確保該 worksheet 只有此資料。</li>
            <li>1.2. 請確保第一欄是 header row：<br />
              以下面為例，columns A, E, H 會被視為裝備名稱，columns C, G, F 會被視為裝備敘述。</li>
          </ol>
          <Image src={img_1} />
          <br /><br />

          <li>2. 至左上方點 File &gt; Share &gt; Publish to Web </li>
          <Image src={img_2} />
          <br /><br />

          <li>3. 選擇 Link 分頁，然後點選你剛剛新創的 worksheet 名字，並將格式選為 CSV 後按 Publish，即可獲得連結 </li>
          <ol>
            <li>3.1. 以下為例，該 worksheet 名字是「full-list」。</li>
          </ol>
          <Image src={img_3} />
          <br /><br />

          <li>4. 到隊伍頁面，凡是領隊、輔領或職位為「裝備」者，可以點選「匯入技術裝備資料」，貼上連結後按下「匯入」按鈕</li>
          <ol>
            <li>4.1. 確認無誤後，按下最下方「確定上傳」</li>
          </ol>
        </ol>
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await unstable_getServerSession(context.req, context.res, authOptions),
    },
  }
}
