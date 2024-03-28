import { BlanccoCustomFiledKeys } from './blancco-custom-field-keys.enum';
import { BlanccoUnknownField } from './blancco-unknown-field';
import { BlanccoBios } from './hardware/blancco-bios';
import { BlanccoDisk } from './hardware/blancco-disk';
import { BlanccoMemory } from './hardware/blancco-memory';
import { BlanccoMotherboard } from './hardware/blancco-motherboard';
import { BlanccoNetworkInterface } from './hardware/blancco-network-interface';
import { BlanccoOpticalDrive } from './hardware/blancco-optical-drive';
import { BlanccoPort } from './hardware/blancco-port';
import { BlanccoProcessor } from './hardware/blancco-processor';
import { BlanccoSoundCard } from './hardware/blancco-sound-card';
import { BlanccoStorageController } from './hardware/blancco-storage-controller';
import { BlanccoSystem } from './hardware/blancco-system';
import { BlanccoUsbDevice } from './hardware/blancco-usb-device';
import { BlanccoVideoCard } from './hardware/blancco-video-card';

type BlanccoComponent = {
  '@type'?: string;
};

type BlanccoHardwareReport = BlanccoUnknownField & {
  system?: BlanccoComponent[] & BlanccoSystem[];
  bios?: BlanccoComponent[] & BlanccoBios[];
  processors?: BlanccoComponent[] & BlanccoProcessor[];
  motherboard?: BlanccoComponent[] & BlanccoMotherboard[];
  memory?: BlanccoComponent[] & BlanccoMemory[];
  disks?: BlanccoUnknownField[] & {
    disk: BlanccoComponent[] & BlanccoDisk[];
  }[];
  optical_drives?: BlanccoUnknownField[] & {
    optical_drive: BlanccoComponent[] & BlanccoOpticalDrive[];
  }[];
  network_interfaces?: BlanccoUnknownField[] & {
    network_interface: BlanccoComponent[] & BlanccoNetworkInterface[];
  }[];
  storage_controllers?: BlanccoUnknownField[] & {
    storage_controller: BlanccoComponent[] & BlanccoStorageController[];
  }[];
  video_cards?: BlanccoUnknownField[] & {
    video_card: BlanccoComponent[] & BlanccoVideoCard[];
  }[];
  sound_cards?: BlanccoUnknownField[] & {
    sound_card: BlanccoComponent[] & BlanccoSoundCard[];
  }[];
  ports?: BlanccoUnknownField[] & {
    port: BlanccoComponent[] & BlanccoPort[];
  }[];
  usb_devices?: BlanccoUnknownField[] & {
    usb_device: BlanccoComponent[] & BlanccoUsbDevice[];
  }[];
};

type BlanccoUserCustomField = BlanccoComponent & {
  [K in BlanccoCustomFiledKeys]?: string;
};

export type BlanccoReportV1 = BlanccoUnknownField & {
  blancco_data: BlanccoUnknownField & {
    description: unknown;
    blancco_erasure_report: BlanccoUnknownField;
    blancco_hardware_report: BlanccoHardwareReport;
  };
  user_data: BlanccoUnknownField & {
    fields: BlanccoUserCustomField[];
  };
};
