import zod from 'zod';
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { parse } from 'csv-parse/sync';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useRouter } from 'next/router';

import { EquipData, EventData } from './event-type';

interface PropType {
  user_id: number,
  event_id: string,
};

type ImportEquipData = {
  techEquip: EquipData[],
};

const csv_url = zod.string().url();

export default function ImportEquipModal({ user_id, event_id }: PropType) {
  const router = useRouter();

  const [link, set_link] = useState('');
  const [wait_submit, set_wait_submit] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm<ImportEquipData>();
  const techEquipFields = useFieldArray({ name: 'techEquip', control })

  const set_url = (e: React.ChangeEvent<HTMLInputElement>) => {
    set_link(e.target.value);
  };

  const parse_csv = async (): Promise<void> => {
    const sanitized = csv_url.safeParse(link);
    if (sanitized.success === false) {
      toast.error(`網址有誤: ${sanitized.error}`);
      return;
    }
    try {
      const equip_kv = await _fetch_parse_csv(sanitized.data);
      Object.keys(equip_kv).forEach((name) => {
        techEquipFields.append({ name, des: equip_kv[name] });
      });
    } catch (err) {
      toast.error("Error in parsing given csv URL: please check that the format is correct.");
    }
  };

  const on_submit: SubmitHandler<EventData> = async (data) => {
    set_wait_submit(true);
    const submitPromise = fetch(`/api/event/${event_id}/import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user_id,
        eventId: event_id,
        formData: {
          ...data,
        },
      })
    })
    const res = await toast.promise(
      submitPromise,
      {
        pending: {
          render() {
            return "Submitting data to server..."
          },
          icon: false,
        },
        error: {
          render() {
            return "There's an error in submitting your data, please try again"
          },
        },
      }
    )
    const res_data = await res.json();
    set_wait_submit(false);
    if (res.ok) {
      toast.success(res_data.message);
      router.push("/event");
    } else {
      toast.error(res_data.message);
    }
  }

  return (
    <dialog className="modal" id="equip_import_modal">
      <div className="modal-box">
        <main className="mb-6">
          <h1 className="font-bold text-lg items-center">匯入資料</h1>
          <h3>請貼上已 publish to web 的 Google Sheet 分享連結：</h3>

          <input type="text" placeholder="URL..." onChange={set_url} className="input input-bordered" />
          <button onClick={parse_csv} className="btn btn-square">匯入</button>
        </main>
        <form onSubmit={handleSubmit(on_submit)}>
          <div className="form-control w-full max-w-s grid grid-cols-2">
            {techEquipFields.fields.map((field, idx) => {
              return (
                <div key={field.id}>
                  <div className="inline-block">
                    <label className="label">裝備名稱</label>
                    <input {...register(`techEquip.${idx}.name` as const, { required: true })} type="text" className="input input-bordered w-full max-w-xs" />
                    {errors.techEquip?.[idx]?.name && <p style={{ color: 'red' }}>裝備名稱不可空！</p>}
                  </div>
                  <div className="inline-block">
                    <label className="label">裝備數量／形容</label>
                    <input {...register(`techEquip.${idx}.des` as const, { required: true })} type="text" className="input input-bordered w-full max-w-xs" />
                  </div>
                  <button type="button" onClick={() => techEquipFields.remove(idx)} className="btn btn-error btn-square inline-block">刪除</button>
                  {errors.techEquip?.[idx]?.des && <p style={{ color: 'red' }}>裝備名稱不可空！</p>}
                </div>
              );
            })}
          </div>
          <br />
          <button type="submit" className="btn btn-outline btn-success btn-block">
            {wait_submit &&
              <progress className='progress w-50' />
            }
            確認上傳
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

/** @throws
 */
const _fetch_parse_csv = async (url: string) => {
  const res_data = await fetch(url).then(res => res.text());
  const records: string[][] = parse(res_data);
  let data = {};
  const column_mapping = records[0];
  for (let r = 1; r < records.length; r++) {
    let key = '';
    records[r].forEach((val, col_idx) => {
      switch (column_mapping[col_idx]) {
        case '項目': {
          key = records[r][col_idx];
          break;
        }
        case '數量': {
          if (key !== '') {
            data[key] = val;
          }
          break;
        }
      }
    });
  }
  return data;
};
