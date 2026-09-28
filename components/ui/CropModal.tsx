"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Plus, X } from "lucide-react";
import { getCroppedBlob } from "@/lib/cloudinary-client";
import {
  ASPECT_RATIO_PRESETS,
  MAX_ASPECT_SIDE,
  ratioText,
  sameAspect,
  type AspectRatioOption,
} from "@/lib/aspect-ratios";
import {
  addCustomAspectRatio,
  getCustomAspectRatios,
  removeCustomAspectRatio,
} from "@/actions/aspect-ratios";

type CropModalProps = {
  imageSrc: string;
  /** The ratio this field is designed for; selected by default. */
  aspect?: number;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
};

type Selection =
  | { kind: "recommended" }
  | { kind: "original" }
  | { kind: "option"; id: string }
  | { kind: "adhoc"; width: number; height: number };

export default function CropModal({
  imageSrc,
  aspect,
  onCancel,
  onConfirm,
}: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  const [originalAspect, setOriginalAspect] = useState<number | null>(null);
  const [customRatios, setCustomRatios] = useState<AspectRatioOption[]>([]);
  const [selection, setSelection] = useState<Selection>(
    aspect ? { kind: "recommended" } : { kind: "original" }
  );

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [customLabel, setCustomLabel] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);
  const [customBusy, setCustomBusy] = useState(false);

  useEffect(() => {
    let active = true;
    getCustomAspectRatios()
      .then((ratios) => {
        if (active) setCustomRatios(ratios);
      })
      .catch(() => {
        // Custom ratios are optional; presets still work without them.
      });
    return () => {
      active = false;
    };
  }, []);

  const allOptions = [...ASPECT_RATIO_PRESETS, ...customRatios];

  function resolveAspect(): number {
    switch (selection.kind) {
      case "recommended":
        return aspect ?? originalAspect ?? 1;
      case "original":
        return originalAspect ?? aspect ?? 1;
      case "adhoc":
        return selection.width / selection.height;
      case "option": {
        const option = allOptions.find((o) => o.id === selection.id);
        return option ? option.width / option.height : aspect ?? 1;
      }
    }
  }
  const currentAspect = resolveAspect();

  function select(next: Selection) {
    setSelection(next);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  const handleCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleConfirm() {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      onConfirm(blob);
    } finally {
      setSaving(false);
    }
  }

  function readCustomInputs() {
    const width = Number(customWidth);
    const height = Number(customHeight);
    if (!(width > 0) || !(height > 0)) {
      setCustomError("Enter a width and height greater than 0");
      return null;
    }
    if (width > MAX_ASPECT_SIDE || height > MAX_ASPECT_SIDE) {
      setCustomError(`Width and height must be at most ${MAX_ASPECT_SIDE}`);
      return null;
    }
    setCustomError(null);
    return { width, height };
  }

  function resetCustomForm() {
    setShowCustomForm(false);
    setCustomWidth("");
    setCustomHeight("");
    setCustomLabel("");
    setCustomError(null);
  }

  function handleApplyOnce() {
    const dims = readCustomInputs();
    if (!dims) return;
    select({ kind: "adhoc", ...dims });
    resetCustomForm();
  }

  async function handleSaveCustom() {
    const dims = readCustomInputs();
    if (!dims) return;
    setCustomBusy(true);
    try {
      const result = await addCustomAspectRatio({
        label: customLabel,
        ...dims,
      });
      if (result.error || !result.ratios) {
        setCustomError(result.error ?? "Could not save aspect ratio");
        return;
      }
      setCustomRatios(result.ratios);
      const added = result.ratios[result.ratios.length - 1];
      if (added) select({ kind: "option", id: added.id });
      resetCustomForm();
    } catch {
      setCustomError("Could not save aspect ratio");
    } finally {
      setCustomBusy(false);
    }
  }

  async function handleRemoveCustom(id: string) {
    const previous = customRatios;
    setCustomRatios((ratios) => ratios.filter((r) => r.id !== id));
    if (selection.kind === "option" && selection.id === id) {
      select(aspect ? { kind: "recommended" } : { kind: "original" });
    }
    try {
      const result = await removeCustomAspectRatio(id);
      if (result.ratios) setCustomRatios(result.ratios);
      else setCustomRatios(previous);
    } catch {
      setCustomRatios(previous);
    }
  }

  const isSelected = (s: Selection) => {
    if (s.kind !== selection.kind) return false;
    if (s.kind === "option" && selection.kind === "option") {
      return s.id === selection.id;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-full w-full max-w-2xl flex-col gap-4 overflow-y-auto rounded-lg bg-white p-4">
        <div className="relative h-80 w-full shrink-0 overflow-hidden rounded bg-stone-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={currentAspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            onMediaLoaded={({ naturalWidth, naturalHeight }) =>
              setOriginalAspect(naturalWidth / naturalHeight)
            }
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-stone-600">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-stone-700">
              Aspect ratio
            </span>
            <span className="text-xs text-stone-500">
              {formatAspect(currentAspect)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {aspect !== undefined && (
              <RatioChip
                label="Recommended"
                sub={formatAspect(aspect)}
                aspect={aspect}
                active={isSelected({ kind: "recommended" })}
                onClick={() => select({ kind: "recommended" })}
              />
            )}
            <RatioChip
              label="Original"
              sub={originalAspect ? formatAspect(originalAspect) : "…"}
              aspect={originalAspect ?? 1}
              active={isSelected({ kind: "original" })}
              onClick={() => select({ kind: "original" })}
            />
            {ASPECT_RATIO_PRESETS.map((option) => (
              <RatioChip
                key={option.id}
                label={ratioText(option.width, option.height)}
                sub={option.label}
                aspect={option.width / option.height}
                active={isSelected({ kind: "option", id: option.id })}
                onClick={() => select({ kind: "option", id: option.id })}
              />
            ))}
            {customRatios.map((option) => (
              <RatioChip
                key={option.id}
                label={ratioText(option.width, option.height)}
                sub={option.label || "Custom"}
                aspect={option.width / option.height}
                active={isSelected({ kind: "option", id: option.id })}
                onClick={() => select({ kind: "option", id: option.id })}
                onRemove={() => handleRemoveCustom(option.id)}
              />
            ))}
            {selection.kind === "adhoc" && (
              <RatioChip
                label={ratioText(selection.width, selection.height)}
                sub="Custom (unsaved)"
                aspect={selection.width / selection.height}
                active
                onClick={() => {}}
              />
            )}
            {!showCustomForm && (
              <button
                type="button"
                onClick={() => setShowCustomForm(true)}
                className="inline-flex items-center gap-1 rounded border border-dashed border-stone-300 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
              >
                <Plus className="h-3.5 w-3.5" />
                Custom
              </button>
            )}
          </div>

          {showCustomForm && (
            <div className="mt-3 rounded border border-stone-200 p-3">
              <div className="flex flex-wrap items-end gap-2">
                <label className="flex flex-col text-xs text-stone-600">
                  Width
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                    placeholder="e.g. 5"
                    className="mt-1 w-20 rounded border border-stone-300 px-2 py-1 text-sm"
                  />
                </label>
                <span className="pb-1.5 text-stone-400">:</span>
                <label className="flex flex-col text-xs text-stone-600">
                  Height
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                    placeholder="e.g. 7"
                    className="mt-1 w-20 rounded border border-stone-300 px-2 py-1 text-sm"
                  />
                </label>
                <label className="flex min-w-32 flex-1 flex-col text-xs text-stone-600">
                  Name (optional)
                  <input
                    type="text"
                    maxLength={40}
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="e.g. Print 5×7"
                    className="mt-1 rounded border border-stone-300 px-2 py-1 text-sm"
                  />
                </label>
              </div>
              {customError && (
                <p className="mt-2 text-sm text-red-600">{customError}</p>
              )}
              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={resetCustomForm}
                  className="rounded px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyOnce}
                  className="rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-100"
                >
                  Use once
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  disabled={customBusy}
                  className="rounded bg-stone-900 px-3 py-1.5 text-sm text-white hover:bg-stone-800 disabled:opacity-50"
                >
                  {customBusy ? "Saving…" : "Save & use"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded px-4 py-2 text-sm text-stone-600 hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving}
            className="rounded bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {saving ? "Processing…" : "Use this crop"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Shows a ratio as "W:H" when it matches a preset, otherwise as a decimal. */
function formatAspect(value: number) {
  const preset = ASPECT_RATIO_PRESETS.find((p) =>
    sameAspect(p.width / p.height, value)
  );
  if (preset) return ratioText(preset.width, preset.height);
  return `${value.toFixed(2)}:1`;
}

function RatioChip({
  label,
  sub,
  aspect,
  active,
  onClick,
  onRemove,
}: {
  label: string;
  sub: string;
  aspect: number;
  active: boolean;
  onClick: () => void;
  onRemove?: () => void;
}) {
  // A tiny rectangle previewing the ratio, fitted inside a 16px box.
  const w = aspect >= 1 ? 16 : Math.max(4, 16 * aspect);
  const h = aspect >= 1 ? Math.max(4, 16 / aspect) : 16;

  return (
    <div
      className={`group relative inline-flex items-center rounded border text-sm ${
        active
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-300 text-stone-700 hover:bg-stone-100"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 px-3 py-1.5"
      >
        <span className="flex h-4 w-4 items-center justify-center">
          <span
            className={`block rounded-[1px] border ${
              active ? "border-white" : "border-stone-500"
            }`}
            style={{ width: w, height: h }}
          />
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span>{label}</span>
          <span
            className={`text-[10px] ${active ? "text-stone-300" : "text-stone-500"}`}
          >
            {sub}
          </span>
        </span>
      </button>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Delete ${label} aspect ratio`}
          title="Delete saved ratio"
          className={`mr-1 rounded p-0.5 ${
            active
              ? "text-stone-300 hover:text-white"
              : "text-stone-400 hover:text-red-600"
          }`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
