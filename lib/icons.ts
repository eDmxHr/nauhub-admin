// Centralized icon exports using Hugeicons with Lucide-compatible API
// This abstraction layer makes it easy to switch icon libraries in the future

import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import * as React from "react";

// Import all icons from hugeicons
import {
  DashboardSquare01Icon,
  SidebarLeft01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
  UnfoldMoreIcon,
  MoreHorizontalIcon,
  Menu01Icon,
  Add01Icon,
  AddCircleIcon,
  PencilEdit02Icon,
  Delete01Icon,
  Cancel01Icon,
  CancelCircleIcon,
  Tick02Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Alert02Icon,
  InformationCircleIcon,
  Loading03Icon,
  Film01Icon,
  Video01Icon,
  VideoReplayIcon,
  FileVideoIcon,
  File01Icon,
  Image01Icon,
  Upload04Icon,
  Download04Icon,
  PlayIcon,
  PlayCircle02Icon,
  UserIcon as HugeUserIcon,
  UserGroupIcon,
  Logout01Icon,
  Logout02Icon,
  ShieldKeyIcon,
  SecurityIcon,
  UserBlock01Icon,
  CreditCardIcon,
  DollarCircleIcon,
  Ticket01Icon,
  Notification02Icon,
  NotificationOff02Icon,
  Folder01Icon,
  Share01Icon,
  LinkSquare02Icon,
  ViewIcon,
  ViewOffIcon,
  GridViewIcon,
  ZoomInAreaIcon,
  Settings02Icon,
  Wrench01Icon,
  ActivityIcon as HugeActivityIcon,
  RefreshIcon,
  Search01Icon,
  CircleIcon as HugeCircleIcon,
  StarIcon,
  TextIcon,
  // Video player icons
  PauseIcon,
  VolumeHighIcon,
  VolumeMute01Icon,
  Maximize01Icon,
  BackwardIcon,
  ForwardIcon,
  // Additional page icons
  Message01Icon,
  Clock01Icon,
  AiCloud01Icon,
  TimeQuarter02Icon,
  LockIcon,
  TickDoubleIcon,
  // Contact icons
  SmartPhone01Icon,
  Mail01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";

// Helper to create Lucide-compatible icon components
function createIcon(iconData: IconSvgElement, displayName: string) {
  const IconComponent = React.forwardRef<
    SVGSVGElement,
    React.ComponentProps<"svg"> & { size?: number | string }
  >((props, ref) => {
    const { className, size, ...restProps } = props;
    const iconSize: number = size ? (typeof size === "string" ? Number(size) : size) : 18;
    return React.createElement(HugeiconsIcon, {
      icon: iconData,
      className: className,
      size: iconSize,
      strokeWidth: 1.5,
      ref: ref,
      ...restProps,
    } as React.ComponentProps<typeof HugeiconsIcon>);
  });
  IconComponent.displayName = displayName;
  return IconComponent;
}

// Navigation & UI
export const LayoutDashboard = createIcon(DashboardSquare01Icon, "LayoutDashboard");
export const PanelLeftIcon = createIcon(SidebarLeft01Icon, "PanelLeftIcon");
export const ChevronRight = createIcon(ArrowRight01Icon, "ChevronRight");
export const ChevronRightIcon = createIcon(ArrowRight01Icon, "ChevronRightIcon");
export const ChevronLeft = createIcon(ArrowLeft01Icon, "ChevronLeft");
export const ChevronDownIcon = createIcon(ArrowDown01Icon, "ChevronDownIcon");
export const ChevronUpIcon = createIcon(ArrowUp01Icon, "ChevronUpIcon");
export const ChevronsUpDown = createIcon(UnfoldMoreIcon, "ChevronsUpDown");
export const ChevronsLeft = createIcon(ArrowLeftDoubleIcon, "ChevronsLeft");
export const ChevronsRight = createIcon(ArrowRightDoubleIcon, "ChevronsRight");
export const MoreHorizontal = createIcon(MoreHorizontalIcon, "MoreHorizontal");
export const MenuIcon = createIcon(Menu01Icon, "MenuIcon");
export const ArrowLeft = createIcon(ArrowLeft01Icon, "ArrowLeft");

// Actions
export const Plus = createIcon(Add01Icon, "Plus");
export const PlusIcon = createIcon(Add01Icon, "PlusIcon");
export const PlusCircle = createIcon(AddCircleIcon, "PlusCircle");
export const Pencil = createIcon(PencilEdit02Icon, "Pencil");
export const Edit2Icon = createIcon(PencilEdit02Icon, "Edit2Icon");
export const Trash2 = createIcon(Delete01Icon, "Trash2");
export const Trash2Icon = createIcon(Delete01Icon, "Trash2Icon");
export const X = createIcon(Cancel01Icon, "X");
export const XIcon = createIcon(Cancel01Icon, "XIcon");
export const XCircle = createIcon(CancelCircleIcon, "XCircle");

// Status & Feedback
export const CheckIcon = createIcon(Tick02Icon, "CheckIcon");
export const Check = createIcon(Tick02Icon, "Check");
export const CheckCircle = createIcon(CheckmarkCircle02Icon, "CheckCircle");
export const CheckCircle2 = createIcon(CheckmarkCircle02Icon, "CheckCircle2");
export const CircleCheckIcon = createIcon(CheckmarkCircle02Icon, "CircleCheckIcon");
export const AlertCircle = createIcon(AlertCircleIcon, "AlertCircle");
export const AlertTriangle = createIcon(Alert02Icon, "AlertTriangle");
export const TriangleAlertIcon = createIcon(Alert02Icon, "TriangleAlertIcon");
export const InfoIcon = createIcon(InformationCircleIcon, "InfoIcon");
export const Loader2 = createIcon(Loading03Icon, "Loader2");
export const Loader2Icon = createIcon(Loading03Icon, "Loader2Icon");
export const LoaderCircleIcon = createIcon(Loading03Icon, "LoaderCircleIcon");
export const LoaderIcon = createIcon(Loading03Icon, "LoaderIcon");
export const CheckCheck = createIcon(TickDoubleIcon, "CheckCheck");

// Media & Files
export const FilmIcon = createIcon(Film01Icon, "FilmIcon");
export const VideoIcon = createIcon(Video01Icon, "VideoIcon");
export const VideotapeIcon = createIcon(VideoReplayIcon, "VideotapeIcon");
export const FileVideo = createIcon(FileVideoIcon, "FileVideo");
export const File = createIcon(File01Icon, "File");
export const ImageIcon = createIcon(Image01Icon, "ImageIcon");
export const Upload = createIcon(Upload04Icon, "Upload");
export const Download = createIcon(Download04Icon, "Download");
export const Play = createIcon(PlayIcon, "Play");
export const PlayCircle = createIcon(PlayCircle02Icon, "PlayCircle");

// Users & Security
export const UserIcon = createIcon(HugeUserIcon, "UserIcon");
export const User = createIcon(HugeUserIcon, "User");
export const Users = createIcon(UserGroupIcon, "Users");
export const Users2 = createIcon(UserGroupIcon, "Users2");
export const LogOut = createIcon(Logout01Icon, "LogOut");
export const ShieldIcon = createIcon(ShieldKeyIcon, "ShieldIcon");
export const Shield = createIcon(SecurityIcon, "Shield");
export const Ban = createIcon(UserBlock01Icon, "Ban");
export const Lock = createIcon(LockIcon, "Lock");

// Finance & Business
export const CreditCard = createIcon(CreditCardIcon, "CreditCard");
export const DollarSignIcon = createIcon(DollarCircleIcon, "DollarSignIcon");
export const TicketIcon = createIcon(Ticket01Icon, "TicketIcon");

// Communication
export const BellIcon = createIcon(Notification02Icon, "BellIcon");
export const Bell = createIcon(Notification02Icon, "Bell");
export const BellOff = createIcon(NotificationOff02Icon, "BellOff");
export const Phone = createIcon(SmartPhone01Icon, "Phone");
export const Mail = createIcon(Mail01Icon, "Mail");
export const Calendar = createIcon(Calendar03Icon, "Calendar");

// Navigation
export const Folder = createIcon(Folder01Icon, "Folder");
export const Forward = createIcon(Share01Icon, "Forward");
export const ExternalLink = createIcon(LinkSquare02Icon, "ExternalLink");

// View & Display
export const Eye = createIcon(ViewIcon, "Eye");
export const EyeOff = createIcon(ViewOffIcon, "EyeOff");
export const Columns2 = createIcon(GridViewIcon, "Columns2");
export const ZoomIn = createIcon(ZoomInAreaIcon, "ZoomIn");

// System & Settings
export const Settings2 = createIcon(Settings02Icon, "Settings2");
export const WrenchIcon = createIcon(Wrench01Icon, "WrenchIcon");
export const ActivityIcon = createIcon(HugeActivityIcon, "ActivityIcon");
export const RefreshCw = createIcon(RefreshIcon, "RefreshCw");
export const SearchIcon = createIcon(Search01Icon, "SearchIcon");
export const CircleIcon = createIcon(HugeCircleIcon, "CircleIcon");
export const Star = createIcon(StarIcon, "Star");

// Power
export const Power = createIcon(Logout02Icon, "Power");
export const PowerOff = createIcon(Logout02Icon, "PowerOff");

// Misc
export const OrigamiIcon = createIcon(TextIcon, "OrigamiIcon");

// Arrow icons for sorting
export const ArrowDown = createIcon(ArrowDown01Icon, "ArrowDown");
export const ArrowUp = createIcon(ArrowUp01Icon, "ArrowUp");

// Video player icons
export const Pause = createIcon(PauseIcon, "Pause");
export const Volume2 = createIcon(VolumeHighIcon, "Volume2");
export const VolumeX = createIcon(VolumeMute01Icon, "VolumeX");
export const Maximize = createIcon(Maximize01Icon, "Maximize");
export const Settings = createIcon(Settings02Icon, "Settings");
export const SkipBack = createIcon(BackwardIcon, "SkipBack");
export const SkipForward = createIcon(ForwardIcon, "SkipForward");

// Additional page icons
export const MessageSquare = createIcon(Message01Icon, "MessageSquare");
export const Clock = createIcon(Clock01Icon, "Clock");
export const Cloud = createIcon(AiCloud01Icon, "Cloud");
export const History = createIcon(TimeQuarter02Icon, "History");
export const FileText = createIcon(File01Icon, "FileText");

// Export the type for icon components (replaces LucideIcon type)
export type { IconSvgElement as IconType };

// Also export a LucideIcon type alias for easier migration
export type LucideIcon = React.ForwardRefExoticComponent<
  React.ComponentProps<"svg"> & { size?: number | string }
>;
