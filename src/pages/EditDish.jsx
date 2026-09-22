import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Icon from "../components/Icon";
import CameraCapture from "../components/CameraCapture";
import CategorySelect from "../components/CategorySelect";
import { useDishes, fetchDishes, updateDish } from "../store/useDishes";
import { uploadPhoto } from "../lib/uploadPhoto";
import { BRAND_GRADIENT } from "../lib/brand";

export default function EditDish() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dishes, loading } = useDishes();
  const dish = dishes.find((d) => d._id === id);

  const [form, setForm] = useState(null);
  const [category, setCategory] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [camOpen, setCamOpen] = useState(false);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (dishes.length === 0 && loading) fetchDishes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dish && !form) {
      setForm({
        name: dish.name,
        price: String(dish.price),
        desc: dish.desc || "",
        tag: dish.tag || "",
        discount: dish.discount ? String(dish.discount) : "",
        spicyLevel: String(dish.spicyLevel ?? 0),
      });
      if (dish.categoryId)
        setCategory({ _id: dish.categoryId, name: dish.category });
    }
  }, [dish, form]);

  if (loading && !dish) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <TopAppBar showBack title="Menu" />
        <p className="text-center text-on-surface-variant py-16 text-body-md">
          Loading…
        </p>
      </div>
    );
  }

  if (!dish || !form) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <TopAppBar showBack title="Menu" />
        <p className="text-center text-on-surface-variant py-16 text-body-md">
          Dish not found.
        </p>
      </div>
    );
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onFile = (file) => setPhoto({ url: URL.createObjectURL(file), file });

  const validate = () => {
    if (!form.name.trim()) return "Dish name is required.";
    if (!form.tag) return "Please select Veg or Non-Veg.";
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) return "Enter a valid price.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setErr(validationError);

    setErr("");
    setSaving(true);
    try {
      let imageKey;
      if (photo) imageKey = await uploadPhoto("dish", photo.file);

      await updateDish(id, {
        name: form.name.trim(),
        ...(category && { category: category.name, categoryId: category._id }),
        price: Number(form.price),
        desc: form.desc.trim(),
        tag: form.tag,
        discount: form.discount ? Number(form.discount) : 0,
        spicyLevel: Number(form.spicyLevel),
        ...(imageKey && { imageKey }),
      });
      navigate("/menu");
    } catch (error) {
      setErr(
        error.response?.data?.error ||
          error.response?.data?.details?.[0]?.message ||
          "Failed to update dish. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const previewUrl = photo?.url || dish.imageUrl;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopAppBar showBack title="Menu" />
      <main className="flex-1 px-margin-mobile pt-stack-md pb-stack-lg animate-fade-in">
        <div className="flex items-center gap-4 mb-stack-lg">
          <div
            className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: BRAND_GRADIENT }}
          >
            <Icon name="edit" className="text-white text-[26px]" />
          </div>
          <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
            Edit Dish
          </h2>
        </div>

        <form className="space-y-stack-lg" onSubmit={submit}>
          <div>
            <p className="text-label-lg font-label-lg text-on-surface-variant mb-2">
              Dish Photo
            </p>
            <div className="aspect-video rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-lowest flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
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
                Retake
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
            required
          />

          <div>
            <p className="block mb-2 text-label-lg font-label-lg text-on-surface-variant">
              Type
            </p>
            <div className="flex gap-3">
              {[
                { value: "veg", label: "Veg", color: "#0fb59b" },
                { value: "non-veg", label: "Non-Veg", color: "#dc2626" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, tag: opt.value }))}
                  className={`flex-1 h-touch-target-min rounded-lg border-2 flex items-center justify-center gap-2 text-label-lg font-label-lg transition-all active:scale-[0.98] ${
                    form.tag === opt.value
                      ? "border-current"
                      : "border-outline-variant text-on-surface-variant"
                  }`}
                  style={
                    form.tag === opt.value
                      ? { color: opt.color, borderColor: opt.color }
                      : undefined
                  }
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border-2"
                    style={{
                      borderColor: opt.color,
                      backgroundColor:
                        form.tag === opt.value ? opt.color : "transparent",
                    }}
                  />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <CategorySelect
            value={category?._id}
            onChange={setCategory}
            required={false}
          />

          <TextField
            label="Price (₹)"
            id="price"
            inputMode="numeric"
            value={form.price}
            onChange={set("price")}
            required
          />

          <div className="grid grid-cols-2 gap-stack-sm">
            <TextField
              label="Discount % (Optional)"
              id="discount"
              inputMode="numeric"
              value={form.discount}
              onChange={set("discount")}
              placeholder="0"
            />
            <div>
              <label
                htmlFor="spicyLevel"
                className="block mb-2 text-label-lg font-label-lg text-on-surface-variant"
              >
                Spice Level
              </label>
              <select
                id="spicyLevel"
                value={form.spicyLevel}
                onChange={set("spicyLevel")}
                className="w-full h-touch-target-min px-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              >
                <option value="0">None</option>
                <option value="1">Mild</option>
                <option value="2">Medium</option>
                <option value="3">Hot</option>
              </select>
            </div>
          </div>

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
            {saving ? "Saving..." : "Save Changes"}
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
