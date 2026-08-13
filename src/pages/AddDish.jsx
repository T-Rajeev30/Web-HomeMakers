import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Icon from "../components/Icon";
import CameraCapture from "../components/CameraCapture";
import { addDish } from "../store/useDishes";
import { categories } from "../data/mock";
import api from "../services/api";
import { BRAND_GRADIENT } from "../lib/brand";

const normalizeContentType = (type) =>
  type === "image/png" ? "image/png" : "image/jpeg";

async function uploadDishImage(file) {
  const contentType = normalizeContentType(file.type);
  const { data } = await api.post("/api/uploads/presign", {
    type: "dish",
    contentType,
  });
  await fetch(data.url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });
  return data.key;
}

export default function AddDish() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    desc: "",
  });
  const [photo, setPhoto] = useState(null); // { url, file }
  const [camOpen, setCamOpen] = useState(false);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onFile = (file) => {
    setPhoto({ url: URL.createObjectURL(file), file });
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      let imageKey;
      if (photo) {
        imageKey = await uploadDishImage(photo.file);
      }
      await addDish({
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        desc: form.desc.trim(),
        ...(imageKey && { imageKey }),
      });
      navigate("/menu");
    } catch (error) {
      setErr(
        error.response?.data?.error ||
          error.response?.data?.details?.[0]?.message ||
          "Failed to add dish. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopAppBar showBack title="Menu" />
      <main className="flex-1 px-margin-mobile pt-stack-md pb-stack-lg animate-fade-in">
        <div className="flex items-center gap-4 mb-stack-lg">
          <div
            className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: BRAND_GRADIENT }}
          >
            <Icon name="add_circle" className="text-white text-[26px]" />
          </div>
          <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
            Add New Dish
          </h2>
        </div>

        <form className="space-y-stack-lg" onSubmit={submit}>
          <div>
            <p className="text-label-lg font-label-lg text-on-surface-variant mb-2">
              Dish Photo (Optional)
            </p>
            <div className="aspect-video rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-lowest flex items-center justify-center overflow-hidden">
              {photo ? (
                <img
                  src={photo.url}
                  alt="Dish"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon name="restaurant" className="text-outline text-[32px]" />
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                icon="photo_camera"
                iconRight={false}
                onClick={() => setCamOpen(true)}
                className="flex-1 h-10 text-label-sm"
              >
                {photo ? "Retake" : "Open camera"}
              </Button>
              <label className="flex-1">
                <span className="inline-flex w-full items-center justify-center gap-2 h-10 px-4 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant text-label-sm font-label-lg cursor-pointer active:scale-[0.98] transition-all">
                  <Icon name="upload" className="text-[18px]" />
                  Upload
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files[0] && onFile(e.target.files[0])
                  }
                />
              </label>
            </div>
          </div>

          <TextField
            label="Dish Name"
            id="name"
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. Veg Thali"
            required
          />

          <div>
            <label
              htmlFor="category"
              className="block mb-2 text-label-lg font-label-lg text-on-surface-variant"
            >
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={set("category")}
              required
              className="w-full h-touch-target-min px-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <TextField
            label="Price (₹)"
            id="price"
            inputMode="numeric"
            value={form.price}
            onChange={set("price")}
            placeholder="0.00"
            required
          />

          <div>
            <label
              htmlFor="desc"
              className="block mb-2 text-label-lg font-label-lg text-on-surface-variant"
            >
              Description (Optional)
            </label>
            <textarea
              id="desc"
              value={form.desc}
              onChange={set("desc")}
              rows={3}
              placeholder="Dish description"
              className="w-full px-4 py-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>

          {err && (
            <div className="flex items-center gap-2 text-error px-4 py-3 bg-error-container rounded-lg">
              <Icon name="error" className="text-base" />
              <span className="text-label-lg font-label-lg">{err}</span>
            </div>
          )}

          <Button full type="submit" disabled={saving}>
            {saving ? "Saving..." : "Create Dish"}
          </Button>
        </form>
      </main>

      {camOpen && (
        <CameraCapture
          title="Capture dish photo"
          onCapture={(file) => {
            onFile(file);
            setCamOpen(false);
          }}
          onClose={() => setCamOpen(false)}
        />
      )}
    </div>
  );
}
