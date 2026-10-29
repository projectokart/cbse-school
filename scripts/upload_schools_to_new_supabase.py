import json
import requests
import time
import os

URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL', 'https://iaqpumtwzqsdbfjmbvmv.supabase.co')
SECRET = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')

# Attempt to load from .env.local if not in environment
if not SECRET:
    env_local = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
    if os.path.exists(env_local):
        with open(env_local, 'r', encoding='utf-8') as ef:
            for line in ef:
                if line.startswith('SUPABASE_SERVICE_ROLE_KEY=') or line.startswith('NEXT_PUBLIC_SUPABASE_ANON_KEY='):
                    SECRET = line.split('=', 1)[1].strip()
                    break

JSON_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src', 'data', 'schools_database.json')

headers = {
    'apikey': SECRET,
    'Authorization': f'Bearer {SECRET}',
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
}

def clean_val(v):
    if v is None: return None
    if isinstance(v, str):
        v = v.strip()
        if v.startswith('=IMAGE("') and v.endswith('")'):
            v = v[8:-2]
    return v

def main():
    if not SECRET:
        print("ERROR: Supabase service role key not found in environment or .env.local!")
        return

    print("[1] Loading schools from schools_database.json...")
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        schools = json.load(f)
    print(f"Total schools loaded: {len(schools)}")

    batch_size = 500
    total = len(schools)
    print(f"[2] Beginning upload to {URL}/rest/v1/udise_private_schools in batches of {batch_size}...")

    success_count = 0
    fail_count = 0

    for i in range(0, total, batch_size):
        batch = schools[i:i + batch_size]
        cleaned_batch = []
        for item in batch:
            row = {
                "udise_code": str(item.get("udise_code") or "").strip(),
                "school_name": clean_val(item.get("school_name")),
                "state_name": clean_val(item.get("state_name")),
                "district_name": clean_val(item.get("district_name")),
                "block_name": clean_val(item.get("block_name")),
                "school_management": clean_val(item.get("school_management")),
                "school_category": clean_val(item.get("school_category")),
                "school_type": clean_val(item.get("school_type")),
                "affiliated_board": clean_val(item.get("affiliated_board")),
                "board_10th": clean_val(item.get("board_10th")),
                "board_12th": clean_val(item.get("board_12th")),
                "address": clean_val(item.get("address")),
                "pincode": str(item.get("pincode") or "").strip(),
                "established_year": clean_val(item.get("established_year")),
                "total_students": item.get("total_students"),
                "total_teachers": item.get("total_teachers"),
                "phone": clean_val(item.get("phone")),
                "email": clean_val(item.get("email")),
                "website": clean_val(item.get("website")),
                "is_verified": bool(item.get("is_verified", False)),
                "is_claimed": bool(item.get("is_claimed", False)),
                "raw_data": item
            }
            if row["udise_code"]:
                cleaned_batch.append(row)

        endpoint = f"{URL}/rest/v1/udise_private_schools?on_conflict=udise_code"
        try:
            resp = requests.post(endpoint, json=cleaned_batch, headers=headers, timeout=30)
            if resp.status_code in (200, 201):
                success_count += len(cleaned_batch)
                print(f"Batch {i//batch_size + 1}/{(total + batch_size - 1)//batch_size}: Uploaded {len(cleaned_batch)} schools (Total: {success_count}/{total})")
            else:
                fail_count += len(cleaned_batch)
                print(f"Batch {i//batch_size + 1} FAILED ({resp.status_code}): {resp.text[:200]}")
        except Exception as e:
            fail_count += len(cleaned_batch)
            print(f"Batch {i//batch_size + 1} EXCEPTION: {e}")

        time.sleep(0.1)

    print("\n================ UPLOAD SUMMARY ================")
    print(f"Total Successfully Uploaded: {success_count}")
    print(f"Total Failed: {fail_count}")

if __name__ == '__main__':
    main()
