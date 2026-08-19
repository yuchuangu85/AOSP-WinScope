/*
 * Copyright (C) 2026 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 */
import {CommonModule} from '@angular/common';
import {Component, input, output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ConnectionState} from '@trace_collection/connection_state';

/** Shows recovery guidance for the launcher-managed capture session. */
@Component({
  selector: 'winscope-proxy-setup',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './winscope_proxy_setup_component.ng.html',
  styleUrls: ['winscope_proxy_setup_component.scss'],
})
export class WinscopeProxySetupComponent {
  ConnectionState = ConnectionState;

  state = input.required<ConnectionState>();
  retryConnection = output<void>();

  onRetryButtonClick() {
    this.retryConnection.emit();
  }
}
